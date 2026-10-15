from __future__ import annotations

from langgraph.runtime import Runtime

from ..context import RecipeDiscoveryContext
from ..state import RecipeDiscoveryState


def generate_recipe(
    state: RecipeDiscoveryState, runtime: Runtime[RecipeDiscoveryContext]
) -> dict[str, object]:
    recipe_name = state.get("generated_recipe_name")
    prompt = state.get("prompt")
    if not recipe_name or not prompt:
        return {"candidate_failed": True}
    try:
        recipe = runtime.context.recipe_generator.generate_recipe(prompt, recipe_name)
    except Exception:
        return {
            "generated_recipe": None,
            "candidate_failed": True,
        }
    return {"generated_recipe": recipe, "candidate_failed": False}
