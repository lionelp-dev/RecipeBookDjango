from __future__ import annotations

from typing import TYPE_CHECKING, Any

from pydantic import BaseModel, ConfigDict, Field

from .generated_ingredient import GeneratedIngredient
from .generated_recipe_step import GeneratedRecipeStep

if TYPE_CHECKING:
    from .recipe import RecipeData


class GeneratedRecipe(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=1000)
    preparationTime: int = Field(ge=0)
    cookingTime: int = Field(ge=0)
    ingredients: list[GeneratedIngredient]
    steps: list[GeneratedRecipeStep] = Field(min_length=1)


def generated_recipe_from_data(data: RecipeData) -> GeneratedRecipe:
    """Adapt the existing Django-validated shape to the graph schema."""

    return GeneratedRecipe.model_validate(data.model_dump(by_alias=True, mode="python"))


def serialize_generated_recipe(recipe: GeneratedRecipe) -> dict[str, Any]:
    """Return the exact JSON shape consumed by the existing React client."""

    return recipe.model_dump(mode="json")
