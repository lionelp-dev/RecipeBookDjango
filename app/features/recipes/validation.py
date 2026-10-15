"""Recipe input validation and conversion to form errors."""

from __future__ import annotations

from typing import Any

from pydantic import ValidationError

from .schemas import RecipeData


class RecipeValidationError(ValueError):
    def __init__(self, errors: dict[str, str]):
        super().__init__("Les données de la recette sont invalides.")
        self.errors = errors


_ERROR_TYPE_MESSAGES = {
    "generated_steps_required": "Une suggestion doit comporter au moins une étape.",
}
_ROOT_ERROR_KEYS = {
    "name": "recipe_name",
    "description": "description",
    "preparationTime": "duration",
    "preparation_time": "duration",
    "cookingTime": "duration",
    "cooking_time": "duration",
    "ingredients": "ingredients",
    "steps": "steps",
}
_ITEM_ERROR_KEYS = {"ingredients": "ingredient", "steps": "step"}
_NESTED_ERROR_KEYS = {
    "ingredients": {"name": "ingredient_name", "quantity": "quantity", "unit": "unit"},
    "steps": {"instruction": "instruction"},
}
_ERROR_MESSAGES = {
    "recipe": "Les données de la recette sont invalides.",
    "invalid_recipe_format": "Le format de la recette est invalide.",
    "recipe_name": "Le nom de la recette est obligatoire.",
    "description": "La description ne peut pas dépasser 1 000 caractères.",
    "duration": "Saisissez un nombre entier positif ou nul.",
    "ingredients": "Les ingrédients doivent former une liste.",
    "ingredient": "Cet ingrédient est invalide.",
    "ingredient_name": "Le nom de l’ingrédient est obligatoire.",
    "quantity": "La quantité doit être un nombre positif (2 décimales maximum).",
    "unit": "L’unité ne peut pas dépasser 50 caractères.",
    "steps": "Les étapes doivent former une liste.",
    "step": "Cette étape est invalide.",
    "instruction": "L’instruction est obligatoire.",
}
_TOO_LONG_MESSAGES = {
    "recipe_name": "Le nom ne peut pas dépasser 100 caractères.",
    "ingredient_name": "Le nom ne peut pas dépasser 100 caractères.",
    "instruction": "L’instruction ne peut pas dépasser 2 000 caractères.",
}


def validate_recipe_data(raw: Any, *, generated: bool = False) -> RecipeData:
    """Validate manual and generated input through the Pydantic recipe schema."""

    try:
        return RecipeData.model_validate(raw, context={"generated": generated})
    except ValidationError as error:
        raise RecipeValidationError(_recipe_validation_errors(error)) from error


def _recipe_validation_errors(error: ValidationError) -> dict[str, str]:
    """Translate Pydantic's structured errors to the French form-error contract."""

    return {
        _error_field(detail["type"], tuple(detail["loc"])): _error_message(
            detail["type"], tuple(detail["loc"])
        )
        for detail in error.errors()
    }


def _error_field(error_type: str, location: tuple[str | int, ...]) -> str:
    if error_type == "generated_steps_required":
        return "steps"
    return ".".join(map(str, location)) or "recipe"


def _error_message(error_type: str, location: tuple[str | int, ...]) -> str:
    if error_type in _ERROR_TYPE_MESSAGES:
        return _ERROR_TYPE_MESSAGES[error_type]

    message_key = _message_key(location)
    if error_type == "string_too_long" and message_key in _TOO_LONG_MESSAGES:
        return _TOO_LONG_MESSAGES[message_key]
    return _ERROR_MESSAGES[message_key]


def _message_key(location: tuple[str | int, ...]) -> str:
    if not location:
        return "invalid_recipe_format"

    root = str(location[0])
    if len(location) == 1:
        return _ROOT_ERROR_KEYS.get(root, "recipe")
    if len(location) == 2 and root in _ITEM_ERROR_KEYS:
        return _ITEM_ERROR_KEYS[root]
    return _NESTED_ERROR_KEYS.get(root, {}).get(str(location[-1]), "recipe")
