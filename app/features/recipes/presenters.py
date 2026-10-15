"""Serialization of recipe models for Inertia props."""

from typing import Any

from app.models import Recipe

from .services.image_storage import image_url

def serialize_recipe(recipe: Recipe) -> dict[str, Any]:
    return {
        "id": recipe.id,
        "name": recipe.name,
        "description": recipe.description,
        "preparationTime": recipe.preparation_time,
        "cookingTime": recipe.cooking_time,
        "imageUrl": image_url(recipe.image_key),
        "imageGenerationStatus": recipe.image_generation_status,
        "ingredients": [
            {
                "id": ingredient.id,
                "name": ingredient.name,
                "quantity": float(ingredient.quantity),
                "unit": ingredient.unit,
                "position": ingredient.position,
            }
            for ingredient in recipe.ingredients.all()
        ],
        "steps": [
            {
                "id": step.id,
                "instruction": step.instruction,
                "position": step.position,
            }
            for step in recipe.steps.all()
        ],
    }
