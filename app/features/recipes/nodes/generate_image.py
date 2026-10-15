from __future__ import annotations

from langgraph.runtime import Runtime

from ..context import RecipeDiscoveryContext
from ..state import RecipeDiscoveryState


def generate_image(
    state: RecipeDiscoveryState, runtime: Runtime[RecipeDiscoveryContext]
) -> dict[str, object]:
    recipe = state.get("generated_recipe")
    if recipe is None:
        return {"image_data_url": None, "image_generation_failed": True}
    try:
        image_data_url = runtime.context.image_generator.generate(recipe.name)
    except Exception:
        image_data_url = None
    return {
        "image_data_url": image_data_url,
        "image_generation_failed": image_data_url is None,
    }
