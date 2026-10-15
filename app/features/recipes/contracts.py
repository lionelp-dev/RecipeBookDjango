from __future__ import annotations

from typing import Protocol

from django.core.files.uploadedfile import UploadedFile

from app.models import Recipe

from .schemas import GeneratedRecipe, RecipeData


class RecipeGenerator(Protocol):
    def is_configured(self) -> bool: ...

    def generate_name(self, prompt: str) -> str: ...

    def generate_recipe(self, prompt: str, recipe_name: str) -> GeneratedRecipe: ...


class RecipeImageGenerator(Protocol):
    def generate(self, recipe_name: str) -> str | None: ...


class RecipeRepository(Protocol):
    def create(
        self, data: RecipeData, image_status: str, image_key: str | None = None
    ) -> Recipe: ...

    def replace(
        self, recipe: Recipe, data: RecipeData, image_status: str, image_key: str | None
    ) -> None: ...


class RecipeImageRepository(Protocol):
    def store_uploaded(self, upload: UploadedFile) -> str: ...

    def store_data_url(self, data_url: str) -> str: ...

    def delete(self, image_key: str) -> None: ...
