import { Check, ChevronRight, LoaderCircle } from "lucide-react";
import {
  useRecipeCollectionContext,
  useRecipeSelectionContext,
} from "../context/RecipeHomeContext";
import { useLoadMoreOnIntersect } from "../hooks/useLoadMoreOnIntersect";

export function RecipeList() {
  const {
    recipes,
    totalItems,
    selectedRecipe,
    recentlyAddedId,
    loadingMore,
    hasNextPage,
    loadMoreError,
    loadMore,
  } = useRecipeCollectionContext();
  const selectRecipe = useRecipeSelectionContext();
  const target = useLoadMoreOnIntersect({
    hasNextPage,
    loading: loadingMore,
    onLoadMore: loadMore,
  });

  return (
    <section
      data-scroll-container
      className="order-2 min-h-0 overflow-y-auto bg-white px-3 py-5 sm:px-5"
    >
      <div className="sticky -top-5 z-10 -mx-3 mb-3 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 sm:-mx-5">
        <h2 className="text-xl font-bold tracking-tight">
          Mes recettes{" "}
          <span className="text-base font-medium text-stone-400">
            · {totalItems}
          </span>
        </h2>
      </div>
      {recipes.length === 0 ? (
        <div className="mx-1 rounded-xl border border-dashed border-stone-300 px-5 py-10 text-center">
          <h3 className="font-semibold">Aucune recette pour le moment</h3>
          <p className="mt-2 text-sm text-stone-500">
            Créez une recette pour commencer votre carnet.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {recipes.map((recipe) => (
            <button
              key={recipe.id}
              type="button"
              onClick={() => selectRecipe(recipe)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${selectedRecipe?.id === recipe.id ? "bg-stone-100" : "hover:bg-stone-50"}`}
            >
              {recipe.imageUrl ? (
                <img
                  src={recipe.imageUrl}
                  alt=""
                  className="size-16 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span className="size-16 shrink-0 rounded-lg bg-stone-200" />
              )}
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold">
                    {recipe.name}
                  </span>
                  {recentlyAddedId === recipe.id && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                      <Check size={12} />
                      Ajoutée
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-xs text-stone-500">
                  Recette · {recipe.preparationTime + recipe.cookingTime} min
                </span>
              </span>
              <ChevronRight size={16} className="text-stone-400" />
            </button>
          ))}
        </div>
      )}
      <div ref={target} className="flex min-h-16 items-center justify-center p-4">
        {loadingMore ? (
          <span className="flex items-center gap-2 text-sm text-stone-500">
            <LoaderCircle className="animate-spin" size={16} />
            Chargement…
          </span>
        ) : loadMoreError ? (
          <button
            onClick={loadMore}
            className="text-sm font-semibold text-red-700 underline"
          >
            {loadMoreError} Réessayer
          </button>
        ) : !hasNextPage && recipes.length > 0 ? (
          <span className="text-xs text-stone-400">
            Toutes les recettes sont chargées.
          </span>
        ) : null}
      </div>
    </section>
  );
}
