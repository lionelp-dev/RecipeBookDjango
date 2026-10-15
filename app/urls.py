from django.urls import path

from .views.discovery import discovery_pool, discovery_redirect, discovery_save
from .views.home import home
from .views.recipes import recipe_create, recipe_create_form, recipe_delete, recipe_edit_form, recipe_update

urlpatterns = [
    path("", home, name="home"),
    path("recipes/new", recipe_create_form, name="recipe_create"),
    path("recipes", recipe_create, name="recipe_store"),
    path("recipes/<int:recipe_id>/edit", recipe_edit_form, name="recipe_edit"),
    path("recipes/<int:recipe_id>", recipe_update, name="recipe_update"),
    path("recipes/<int:recipe_id>/delete", recipe_delete, name="recipe_delete"),
    path("recipes/discover", discovery_redirect, name="discovery"),
    path("recipes/discover/pool", discovery_pool, name="discovery_pool"),
    path("recipes/discover/save", discovery_save, name="discovery_save"),
]
