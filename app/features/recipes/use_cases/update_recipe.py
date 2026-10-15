from __future__ import annotations

from django.core.files.uploadedfile import UploadedFile
from django.db import transaction

from app.models import Recipe

from ..contracts import RecipeImageRepository, RecipeRepository
from ..schemas import RecipeData


class UpdateRecipeUseCase:
    def __init__(self, recipes: RecipeRepository, images: RecipeImageRepository) -> None:
        self.recipes = recipes
        self.images = images

    def execute(
        self,
        recipe: Recipe,
        data: RecipeData,
        uploaded_image: UploadedFile | None,
        remove_image: bool,
    ) -> None:
        previous_image_key = recipe.image_key
        image_key = previous_image_key
        image_status = recipe.image_generation_status
        new_image_key: str | None = None

        try:
            if uploaded_image:
                new_image_key = self.images.store_uploaded(uploaded_image)
                image_key = new_image_key
                image_status = Recipe.ImageGenerationStatus.READY
            elif remove_image:
                image_key = None
                image_status = Recipe.ImageGenerationStatus.NOT_REQUESTED

            with transaction.atomic():
                self.recipes.replace(recipe, data, image_status, image_key)
                if previous_image_key and previous_image_key != image_key:
                    transaction.on_commit(
                        lambda image_key=previous_image_key: self.images.delete(image_key)
                    )
        except Exception:
            if new_image_key:
                self.images.delete(new_image_key)
            raise
