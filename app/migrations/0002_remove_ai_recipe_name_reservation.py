from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [("app", "0001_recipe_book")]

    operations = [
        migrations.DeleteModel(name="AiRecipeNameReservation"),
    ]
