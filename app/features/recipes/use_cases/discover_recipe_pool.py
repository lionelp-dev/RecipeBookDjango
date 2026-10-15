from __future__ import annotations

from typing import Any

from ..context import RecipeDiscoveryContext
from ..contracts import RecipeGenerator, RecipeImageGenerator
from ..graphs.recipe_discovery import recipe_discovery_graph
from ..schemas import GeneratedRecipe, serialize_generated_recipe
from ..state import RecipeDiscoveryState

POOL_SIZE = 10
MAX_CONCURRENCY = 5


class DiscoverRecipePoolUseCase:
    def __init__(
        self,
        recipe_generator: RecipeGenerator,
        image_generator: RecipeImageGenerator,
    ) -> None:
        self.recipe_generator = recipe_generator
        self.image_generator = image_generator

    def is_configured(self) -> bool:
        return self.recipe_generator.is_configured()

    def execute(self, prompt: str) -> dict[str, Any]:
        context = RecipeDiscoveryContext(
            recipe_generator=self.recipe_generator,
            image_generator=self.image_generator,
        )
        initial_state: RecipeDiscoveryState = {
            "prompt": prompt,
            "generation_attempts": 0,
            "generated_recipe_name": None,
            "generated_recipe": None,
            "candidate_failed": False,
            "image_data_url": None,
            "image_generation_failed": False,
        }
        results = recipe_discovery_graph.batch(
            [initial_state.copy() for _ in range(POOL_SIZE)],
            config={"max_concurrency": MAX_CONCURRENCY},
            context=context,
            return_exceptions=True,
        )

        recipes: list[dict[str, Any]] = []
        for result in results:
            if isinstance(result, Exception):
                continue
            recipe = result.get("generated_recipe")
            if not isinstance(recipe, GeneratedRecipe) or result.get("candidate_failed"):
                continue
            recipes.append(
                {
                    **serialize_generated_recipe(recipe),
                    "imageDataUrl": result.get("image_data_url"),
                    "imageGenerationFailed": bool(result.get("image_generation_failed")),
                }
            )

        return {"recipes": recipes, "failedRecipeCount": POOL_SIZE - len(recipes)}
