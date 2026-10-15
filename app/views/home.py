from __future__ import annotations

from typing import Any

from django.core.paginator import Paginator
from django.http import HttpRequest, HttpResponse
from django.views.decorators.http import require_GET
from inertia import render

from ..features.recipes.presenters import serialize_recipe
from ..features.recipes.queries import recipe_queryset


def home_props(request: HttpRequest, **extra: Any) -> dict[str, Any]:
    """Prepare the data used by the Home Inertia page."""

    paginator = Paginator(recipe_queryset(), 6)
    page = paginator.get_page(request.GET.get("page", 1))

    return {
        "recipes": [serialize_recipe(recipe) for recipe in page.object_list],
        "totalItems": paginator.count,
        "currentPage": page.number,
        "lastPage": paginator.num_pages or 1,
        **extra,
    }


@require_GET
def home(request: HttpRequest) -> HttpResponse:
    return render(request, "Home", home_props(request))
