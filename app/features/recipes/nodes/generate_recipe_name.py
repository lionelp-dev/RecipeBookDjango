from __future__ import annotations

from langgraph.runtime import Runtime

from ..context import RecipeDiscoveryContext
from ..state import RecipeDiscoveryState


def generate_recipe_name(
    state: RecipeDiscoveryState, runtime: Runtime[RecipeDiscoveryContext]
) -> dict[str, object]:
    attempts = state.get("generation_attempts", 0) + 1
    prompt = state.get("prompt")
    if not prompt:
        return {
            "generation_attempts": attempts,
            "generated_recipe_name": None,
            "generated_recipe": None,
            "candidate_failed": True,
            "image_data_url": None,
            "image_generation_failed": False,
        }
    try:
        recipe_name = runtime.context.recipe_generator.generate_name(prompt)
    except Exception:
        return {
            "generation_attempts": attempts,
            "generated_recipe_name": None,
            "generated_recipe": None,
            "candidate_failed": True,
            "image_data_url": None,
            "image_generation_failed": False,
        }
    return {
        "generation_attempts": attempts,
        "generated_recipe_name": recipe_name,
        "generated_recipe": None,
        "candidate_failed": False,
        "image_data_url": None,
        "image_generation_failed": False,
    }
