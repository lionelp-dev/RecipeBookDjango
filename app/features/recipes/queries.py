"""Optimized read queries for recipes."""

from django.db.models import Prefetch, QuerySet

from app.models import Recipe, RecipeIngredient, RecipeStep


def recipe_queryset() -> QuerySet[Recipe]:
    return Recipe.objects.prefetch_related(
        Prefetch("ingredients", queryset=RecipeIngredient.objects.order_by("position", "id")),
        Prefetch("steps", queryset=RecipeStep.objects.order_by("position", "id")),
    ).order_by("-id")
