import { router, usePoll } from "@inertiajs/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { csrfHeaders } from "../../../lib/csrf";
import type { Recipe } from "../../../types";
import type { RecipeHomeProps } from "../types";
import { deduplicateRecipes } from "../utils/recipes";

type RecipeCollectionInitialData = Pick<
  RecipeHomeProps,
  "recipes" | "totalItems" | "currentPage" | "lastPage"
>;

export function useRecipeCollection({
  recipes: initialRecipes,
  totalItems: initialTotalItems,
  currentPage: initialCurrentPage,
  lastPage: initialLastPage,
}: RecipeCollectionInitialData) {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [lastPage, setLastPage] = useState(initialLastPage);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<number | null>(null);

  const selectedRecipe = useMemo(
    () =>
      recipes.find((recipe) => recipe.id === selectedRecipeId) ??
      recipes[0] ??
      null,
    [recipes, selectedRecipeId],
  );
  const hasNextPage = currentPage < lastPage;

  const mergePage = useCallback(
    (page: Partial<RecipeHomeProps>, prepend = true) => {
      const incomingRecipes = page.recipes;
      if (!incomingRecipes) return;

      setRecipes((current) =>
        deduplicateRecipes(
          prepend
            ? [...incomingRecipes, ...current]
            : [...current, ...incomingRecipes],
        ),
      );
      if (typeof page.totalItems === "number") setTotalItems(page.totalItems);
      if (typeof page.currentPage === "number") setCurrentPage(page.currentPage);
      if (typeof page.lastPage === "number") setLastPage(page.lastPage);
    },
    [],
  );

  usePoll(5_000, {
    only: ["recipes", "totalItems", "currentPage", "lastPage"],
    onSuccess: (page) =>
      mergePage(page.props as unknown as Partial<RecipeHomeProps>),
  });

  useEffect(() => {
    if (recentlyAddedId === null) return;

    const timeout = window.setTimeout(() => setRecentlyAddedId(null), 5_000);
    return () => window.clearTimeout(timeout);
  }, [recentlyAddedId]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasNextPage) return;

    setLoadingMore(true);
    setLoadMoreError(null);
    router.get(
      "/",
      { page: currentPage + 1 },
      {
        only: ["recipes", "totalItems", "currentPage", "lastPage"],
        preserveState: true,
        preserveScroll: true,
        preserveUrl: true,
        onSuccess: (page) =>
          mergePage(page.props as unknown as Partial<RecipeHomeProps>, false),
        onError: () => setLoadMoreError("Le chargement des recettes a échoué."),
        onFinish: () => setLoadingMore(false),
      },
    );
  }, [currentPage, hasNextPage, loadingMore, mergePage]);

  const refresh = useCallback(() => {
    router.reload({
      only: ["recipes", "totalItems", "currentPage", "lastPage"],
      onSuccess: (page) =>
        mergePage(page.props as unknown as Partial<RecipeHomeProps>),
    });
  }, [mergePage]);

  const deleteRecipe = useCallback((recipe: Recipe) => {
    router.delete(`/recipes/${recipe.id}/delete`, {
      headers: csrfHeaders(),
      preserveState: false,
    });
  }, []);

  return {
    recipes,
    totalItems,
    selectedRecipe,
    hasNextPage,
    loadingMore,
    loadMoreError,
    recentlyAddedId,
    selectRecipe: setSelectedRecipeId,
    loadMore,
    refresh,
    markRecentlyAdded: setRecentlyAddedId,
    deleteRecipe,
  };
}
