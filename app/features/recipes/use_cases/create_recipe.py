from __future__ import annotations

from django.core.files.uploadedfile import UploadedFile
from django.db import transaction

from app.models import Recipe

from ..contracts import RecipeImageRepository, RecipeRepository
from ..schemas import RecipeData


class CreateRecipeUseCase:
    def __init__(self, recipes: RecipeRepository, images: RecipeImageRepository) -> None:
        self.recipes = recipes
        self.images = images

    def execute(self, data: RecipeData, uploaded_image: UploadedFile | None) -> Recipe:
        image_key: str | None = None
        try:
            if uploaded_image:
                image_key = self.images.store_uploaded(uploaded_image)
            image_status = (
                Recipe.ImageGenerationStatus.READY
                if image_key
                else Recipe.ImageGenerationStatus.NOT_REQUESTED
            )
            with transaction.atomic():
                return self.recipes.create(data, image_status, image_key)
        except Exception:
            if image_key:
                self.images.delete(image_key)
            raise
