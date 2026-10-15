from django.db import models


class RecipeIngredient(models.Model):
    id: int

    recipe = models.ForeignKey("Recipe", on_delete=models.CASCADE, related_name="ingredients")
    name = models.CharField(max_length=100)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50, blank=True, null=True)
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ["position", "id"]
        constraints = [
            models.UniqueConstraint(fields=["recipe", "position"], name="recipe_ingredient_position")
        ]
