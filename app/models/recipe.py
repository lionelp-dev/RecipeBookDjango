from __future__ import annotations

from typing import TYPE_CHECKING

from django.db import models

from ._types import RelatedCollection

if TYPE_CHECKING:
    from .recipe_ingredient import RecipeIngredient
    from .recipe_step import RecipeStep


class Recipe(models.Model):
    id: int
    ingredients: RelatedCollection[RecipeIngredient]
    steps: RelatedCollection[RecipeStep]

    class ImageGenerationStatus(models.TextChoices):
        NOT_REQUESTED = "not_requested", "Not requested"
        PENDING = "pending", "Pending"
        READY = "ready", "Ready"
        FAILED = "failed", "Failed"

    name = models.CharField(max_length=100)
    description = models.TextField(max_length=1000, blank=True, null=True)
    preparation_time = models.PositiveIntegerField(default=0)
    cooking_time = models.PositiveIntegerField(default=0)
    image_key = models.CharField(max_length=255, blank=True, null=True)
    image_generation_status = models.CharField(
        max_length=20,
        choices=ImageGenerationStatus.choices,
        default=ImageGenerationStatus.NOT_REQUESTED,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self) -> str:
        return self.name
