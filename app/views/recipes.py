from __future__ import annotations

import json
from typing import Any

from django.contrib import messages
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.http import require_GET, require_http_methods, require_POST
from inertia import render

from ..features.recipes.factories import (
    create_create_recipe_use_case,
    create_update_recipe_use_case,
)
from ..features.recipes.presenters import serialize_recipe
from ..features.recipes.queries import recipe_queryset
from ..features.recipes.services.image_storage import ImageValidationError
from ..features.recipes.validation import RecipeValidationError, validate_recipe_data
from ..models import Recipe


def _recipe_data_from_form(request: HttpRequest) -> dict[str, Any]:
    """Read the recipe JSON sent alongside the optional image file."""

    try:
        recipe_data = json.loads(request.POST.get("recipe", ""))
    except json.JSONDecodeError as error:
        raise RecipeValidationError({"recipe": "Les données de la recette sont invalides."}) from error

    if not isinstance(recipe_data, dict):
        raise RecipeValidationError({"recipe": "Les données de la recette sont invalides."})
    return recipe_data


@require_GET
def recipe_create_form(request: HttpRequest) -> HttpResponse:
    return render(request, "Recipes/New")


@require_POST
def recipe_create(request: HttpRequest) -> HttpResponse:
    try:
        recipe_data = _recipe_data_from_form(request)
        data = validate_recipe_data(recipe_data)
    except RecipeValidationError as error:
        return render(request, "Recipes/New", {"errors": error.errors})

    try:
        create_create_recipe_use_case().execute(data, request.FILES.get("image"))
    except ImageValidationError as error:
        return render(request, "Recipes/New", {"errors": {"image": str(error)}})

    messages.success(request, "La recette a été créée.")
    return redirect("home")


@require_GET
def recipe_edit_form(request: HttpRequest, recipe_id: int) -> HttpResponse:
    recipe = get_object_or_404(recipe_queryset(), pk=recipe_id)
    return render(request, "Recipes/Edit", {"recipe": serialize_recipe(recipe)})


@require_POST
def recipe_update(request: HttpRequest, recipe_id: int) -> HttpResponse:
    recipe = get_object_or_404(recipe_queryset(), pk=recipe_id)

    recipe_data: dict[str, Any] = {}
    try:
        recipe_data = _recipe_data_from_form(request)
        data = validate_recipe_data(recipe_data)
    except RecipeValidationError as error:
        recipe_for_form = {**serialize_recipe(recipe), **recipe_data}
        return render(request, "Recipes/Edit", {"errors": error.errors, "recipe": recipe_for_form})

    try:
        create_update_recipe_use_case().execute(
            recipe,
            data,
            request.FILES.get("image"),
            request.POST.get("removeImage", "").lower() in {"1", "true", "on"},
        )
    except ImageValidationError as error:
        return render(
            request,
            "Recipes/Edit",
            {"errors": {"image": str(error)}, "recipe": serialize_recipe(recipe)},
        )

    messages.success(request, "La recette a été modifiée.")
    return redirect("home")


@require_http_methods(["DELETE"])
def recipe_delete(request: HttpRequest, recipe_id: int) -> HttpResponse:
    recipe = get_object_or_404(Recipe, pk=recipe_id)
    recipe.delete()
    messages.success(request, "La recette a été supprimée.")
    return redirect("home")
