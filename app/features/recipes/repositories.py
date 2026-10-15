from __future__ import annotations

from django.core.files.uploadedfile import UploadedFile

from app.models import Recipe, RecipeIngredient, RecipeStep

from .schemas import RecipeData
from .services.image_storage import delete_recipe_image, store_data_url, store_uploaded_image


class DjangoRecipeRepository:
    def create(
        self, data: RecipeData, image_status: str, image_key: str | None = None
    ) -> Recipe:
        recipe = Recipe.objects.create(
            name=data.name,
            description=data.description,
            preparation_time=data.preparation_time,
            cooking_time=data.cooking_time,
            image_key=image_key,
            image_generation_status=image_status,
        )
        RecipeIngredient.objects.bulk_create(
            [
                RecipeIngredient(recipe=recipe, position=index, **ingredient.model_dump())
                for index, ingredient in enumerate(data.ingredients)
            ]
        )
        RecipeStep.objects.bulk_create(
            [
                RecipeStep(recipe=recipe, position=index, **step.model_dump())
                for index, step in enumerate(data.steps)
            ]
        )
        return recipe

    def replace(
        self, recipe: Recipe, data: RecipeData, image_status: str, image_key: str | None
    ) -> None:
        recipe.name = data.name
        recipe.description = data.description
        recipe.preparation_time = data.preparation_time
        recipe.cooking_time = data.cooking_time
        recipe.image_key = image_key
        recipe.image_generation_status = image_status
        recipe.save()
        recipe.ingredients.all().delete()
        recipe.steps.all().delete()
        RecipeIngredient.objects.bulk_create(
            [
                RecipeIngredient(recipe=recipe, position=index, **ingredient.model_dump())
                for index, ingredient in enumerate(data.ingredients)
            ]
        )
        RecipeStep.objects.bulk_create(
            [
                RecipeStep(recipe=recipe, position=index, **step.model_dump())
                for index, step in enumerate(data.steps)
            ]
        )


class DjangoRecipeImageRepository:
    def store_uploaded(self, upload: UploadedFile) -> str:
        return store_uploaded_image(upload)

    def store_data_url(self, data_url: str) -> str:
        return store_data_url(data_url)

    def delete(self, image_key: str) -> None:
        delete_recipe_image(image_key)
