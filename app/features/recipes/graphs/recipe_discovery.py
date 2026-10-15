from __future__ import annotations

from langgraph.graph import END, START, StateGraph

from ..context import RecipeDiscoveryContext
from ..nodes.generate_image import generate_image
from ..nodes.generate_recipe import generate_recipe
from ..nodes.generate_recipe_name import generate_recipe_name
from ..state import RecipeDiscoveryState

MAX_RECIPE_GENERATION_ATTEMPTS = 3

def _retry_or_end(state: RecipeDiscoveryState) -> str:
    return (
        "generate_recipe_name"
        if state.get("generation_attempts", 0) < MAX_RECIPE_GENERATION_ATTEMPTS
        else END
    )


def _after_recipe_name_generation(state: RecipeDiscoveryState) -> str:
    return _retry_or_end(state) if state.get("candidate_failed") else "generate_recipe"


def _after_recipe_generation(state: RecipeDiscoveryState) -> str:
    return _retry_or_end(state) if state.get("candidate_failed") else "generate_image"


recipe_discovery_graph = (
    StateGraph(RecipeDiscoveryState, context_schema=RecipeDiscoveryContext)
    .add_node("generate_recipe_name", generate_recipe_name)
    .add_node("generate_recipe", generate_recipe)
    .add_node("generate_image", generate_image)
    .add_edge(START, "generate_recipe_name")
    .add_conditional_edges("generate_recipe_name", _after_recipe_name_generation)
    .add_conditional_edges("generate_recipe", _after_recipe_generation)
    .add_edge("generate_image", END)
    .compile()
)
