import type { Recipe } from "../../../types";

export function deduplicateRecipes(recipes: Recipe[]) {
  const ids = new Set<number>();

  return recipes.filter(
    (recipe) => !ids.has(recipe.id) && (ids.add(recipe.id), true),
  );
}
