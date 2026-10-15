from __future__ import annotations

import json
from typing import Any

from django.http import HttpRequest, HttpResponse
from django.shortcuts import redirect
from django.views.decorators.http import require_POST
from inertia import render

from ..features.recipes.factories import (
    create_discover_recipe_pool_use_case,
    create_save_discovered_recipe_use_case,
)
from ..features.recipes.services.image_storage import ImageValidationError
from ..features.recipes.validation import RecipeValidationError, validate_recipe_data
from .home import home_props


def _json_body(request: HttpRequest) -> dict[str, Any]:
    """Read a JSON request body and return an understandable validation error."""

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise RecipeValidationError({"request": "Le corps de la requête est invalide."}) from error

    if not isinstance(payload, dict):
        raise RecipeValidationError({"request": "Le corps de la requête est invalide."})
    return payload


@require_POST
def discovery_pool(request: HttpRequest) -> HttpResponse:
    try:
        payload = _json_body(request)
        prompt = payload.get("prompt")
        if not isinstance(prompt, str) or not (3 <= len(prompt.strip()) <= 5000):
            raise RecipeValidationError({"prompt": "Décrivez votre envie en 3 à 5 000 caractères."})
    except RecipeValidationError as error:
        return render(request, "Home", home_props(request, discoveryError=next(iter(error.errors.values()))))

    discover_recipe_pool = create_discover_recipe_pool_use_case()
    if not discover_recipe_pool.is_configured():
        response = render(
            request,
            "Home",
            home_props(request, discoveryError="La génération IA n’est pas configurée sur ce serveur."),
        )
        response.status_code = 503
        return response

    try:
        pool = discover_recipe_pool.execute(prompt.strip())
    except Exception:
        pool = {"recipes": [], "failedRecipeCount": 10}
    return render(request, "Home", home_props(request, discoveryPool=pool))


@require_POST
def discovery_save(request: HttpRequest) -> HttpResponse:
    try:
        payload = _json_body(request)
        data = validate_recipe_data(payload.get("recipe"), generated=True)
        image_data_url = payload.get("imageDataUrl")
        if image_data_url is not None and not isinstance(image_data_url, str):
            raise RecipeValidationError({"imageDataUrl": "Le format de l’image est invalide."})
    except RecipeValidationError as error:
        return render(request, "Home", home_props(request, saveError=next(iter(error.errors.values()))))

    try:
        saved_recipe_id = create_save_discovered_recipe_use_case().execute(
            data, image_data_url
        )
    except ImageValidationError as error:
        return render(request, "Home", home_props(request, saveError=str(error)))
    return render(request, "Home", home_props(request, savedRecipeId=saved_recipe_id))


def discovery_redirect(request: HttpRequest) -> HttpResponse:
    return redirect("home")
