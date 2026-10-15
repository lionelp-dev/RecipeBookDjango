from __future__ import annotations

from django.db import transaction

from ..contracts import RecipeImageRepository, RecipeRepository
from ..schemas import RecipeData


class SaveDiscoveredRecipeUseCase:
    def __init__(self, recipes: RecipeRepository, images: RecipeImageRepository) -> None:
        self.recipes = recipes
        self.images = images

    def execute(self, recipe: RecipeData, image_data_url: str | None) -> int:
        image_key: str | None = None
        try:
            if image_data_url:
                image_key = self.images.store_data_url(image_data_url)
            with transaction.atomic():
                return self.recipes.create(
                    recipe,
                    "ready" if image_key else "not_requested",
                    image_key,
                ).id
        except Exception:
            if image_key:
                self.images.delete(image_key)
            raise
