from django.db import models


class RecipeStep(models.Model):
    id: int

    recipe = models.ForeignKey("Recipe", on_delete=models.CASCADE, related_name="steps")
    instruction = models.TextField(max_length=2000)
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ["position", "id"]
        constraints = [
            models.UniqueConstraint(fields=["recipe", "position"], name="recipe_step_position")
        ]
