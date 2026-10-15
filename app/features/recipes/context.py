from __future__ import annotations

from dataclasses import dataclass

from .contracts import (
    RecipeGenerator,
    RecipeImageGenerator,
)


@dataclass(frozen=True, slots=True)
class RecipeDiscoveryContext:
    recipe_generator: RecipeGenerator
    image_generator: RecipeImageGenerator
