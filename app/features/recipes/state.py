from __future__ import annotations

from typing import TypedDict

from .schemas import GeneratedRecipe


class RecipeDiscoveryState(TypedDict, total=False):
    prompt: str
    generation_attempts: int
    generated_recipe_name: str | None
    generated_recipe: GeneratedRecipe | None
    candidate_failed: bool
    image_data_url: str | None
    image_generation_failed: bool
