# pyright: reportArgumentType=false
# Generated as the initial schema for the Django recipe book.

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="AiRecipeNameReservation",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("normalized_name", models.CharField(max_length=100, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Recipe",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
                ("description", models.TextField(blank=True, max_length=1000, null=True)),
                ("preparation_time", models.PositiveIntegerField(default=0)),
                ("cooking_time", models.PositiveIntegerField(default=0)),
                ("image_key", models.CharField(blank=True, max_length=255, null=True)),
                ("image_generation_status", models.CharField(choices=[("not_requested", "Not requested"), ("pending", "Pending"), ("ready", "Ready"), ("failed", "Failed")], default="not_requested", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-id"]},
        ),
        migrations.CreateModel(
            name="RecipeIngredient",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
                ("quantity", models.DecimalField(decimal_places=2, max_digits=10)),
                ("unit", models.CharField(blank=True, max_length=50, null=True)),
                ("position", models.PositiveIntegerField()),
                ("recipe", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="ingredients", to="app.recipe")),
            ],
            options={"ordering": ["position", "id"]},
        ),
        migrations.CreateModel(
            name="RecipeStep",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("instruction", models.TextField(max_length=2000)),
                ("position", models.PositiveIntegerField()),
                ("recipe", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="steps", to="app.recipe")),
            ],
            options={"ordering": ["position", "id"]},
        ),
        migrations.AddConstraint(
            model_name="recipeingredient",
            constraint=models.UniqueConstraint(fields=("recipe", "position"), name="recipe_ingredient_position"),
        ),
        migrations.AddConstraint(
            model_name="recipestep",
            constraint=models.UniqueConstraint(fields=("recipe", "position"), name="recipe_step_position"),
        ),
    ]
