from __future__ import annotations

from .repositories import (
    DjangoRecipeImageRepository,
    DjangoRecipeRepository,
)
from .services.openrouter import OpenRouterRecipeGenerator, OpenRouterRecipeImageGenerator
from .use_cases.create_recipe import CreateRecipeUseCase
from .use_cases.discover_recipe_pool import DiscoverRecipePoolUseCase
from .use_cases.save_discovered_recipe import SaveDiscoveredRecipeUseCase
from .use_cases.update_recipe import UpdateRecipeUseCase


def create_create_recipe_use_case() -> CreateRecipeUseCase:
    return CreateRecipeUseCase(
        recipes=DjangoRecipeRepository(),
        images=DjangoRecipeImageRepository(),
    )


def create_update_recipe_use_case() -> UpdateRecipeUseCase:
    return UpdateRecipeUseCase(
        recipes=DjangoRecipeRepository(),
        images=DjangoRecipeImageRepository(),
    )


def create_discover_recipe_pool_use_case() -> DiscoverRecipePoolUseCase:
    return DiscoverRecipePoolUseCase(
        recipe_generator=OpenRouterRecipeGenerator(),
        image_generator=OpenRouterRecipeImageGenerator(),
    )


def create_save_discovered_recipe_use_case() -> SaveDiscoveredRecipeUseCase:
    return SaveDiscoveredRecipeUseCase(
        recipes=DjangoRecipeRepository(),
        images=DjangoRecipeImageRepository(),
    )
