from django.db.models.signals import post_delete
from django.dispatch import receiver

from app.features.recipes.services.image_storage import delete_recipe_image

from .recipe import Recipe


@receiver(post_delete, sender=Recipe)
def remove_deleted_recipe_image(sender, instance: Recipe, **kwargs) -> None:
    """Keep the media directory in step with cascaded recipe deletions."""

    delete_recipe_image(instance.image_key)
