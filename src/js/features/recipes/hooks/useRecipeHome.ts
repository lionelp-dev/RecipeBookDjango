import { useCallback } from "react";
import type { Recipe } from "../../../types";
import type { RecipeHomeProps } from "../types";
import { useRecipeCollection } from "./useRecipeCollection";
import { useRecipeDiscovery } from "./useRecipeDiscovery";

export function useRecipeHome(props: RecipeHomeProps) {
  const collection = useRecipeCollection(props);
  const handleRecipeSaved = useCallback(
    (recipeId: number) => {
      collection.markRecentlyAdded(recipeId);
      collection.refresh();
    },
    [collection.markRecentlyAdded, collection.refresh],
  );
  const discovery = useRecipeDiscovery({ onRecipeSaved: handleRecipeSaved });
  const selectRecipe = useCallback(
    (recipe: Recipe) => {
      collection.selectRecipe(recipe.id);
      discovery.pauseForRecipeSelection();
    },
    [collection.selectRecipe, discovery.pauseForRecipeSelection],
  );

  return { collection, discovery, selectRecipe };
}
