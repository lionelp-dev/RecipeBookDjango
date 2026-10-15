"""Pydantic schemas for recipe data received by the application."""

from __future__ import annotations

from decimal import Decimal
from typing import Any, Self

from pydantic import (
    AliasChoices,
    BaseModel,
    ConfigDict,
    Field,
    ValidationInfo,
    field_validator,
    model_validator,
)
from pydantic_core import PydanticCustomError


class RecipeIngredientData(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=100)
    quantity: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    unit: str | None = Field(default=None, max_length=50)

    @field_validator("unit", mode="before")
    @classmethod
    def empty_unit_is_none(cls, value: Any) -> str | None:
        return value.strip() or None if isinstance(value, str) else None


class RecipeStepData(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    instruction: str = Field(min_length=1, max_length=2000)


class RecipeData(BaseModel):
    """Validated recipe payload used by both manual and generated recipes."""

    model_config = ConfigDict(str_strip_whitespace=True, populate_by_name=True)

    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=1000)
    preparation_time: int = Field(
        ge=0,
        validation_alias=AliasChoices("preparationTime", "preparation_time"),
        serialization_alias="preparationTime",
    )
    cooking_time: int = Field(
        ge=0,
        validation_alias=AliasChoices("cookingTime", "cooking_time"),
        serialization_alias="cookingTime",
    )
    ingredients: list[RecipeIngredientData] = Field(default_factory=list)
    steps: list[RecipeStepData] = Field(default_factory=list)

    @field_validator("description", mode="before")
    @classmethod
    def empty_description_is_none(cls, value: Any) -> str | None:
        return value.strip() or None if isinstance(value, str) else None

    @model_validator(mode="after")
    def generated_recipes_need_a_step(self, info: ValidationInfo) -> Self:
        if info.context and info.context.get("generated") and not self.steps:
            raise PydanticCustomError(
                "generated_steps_required", "Une suggestion doit comporter au moins une étape."
            )
        return self
