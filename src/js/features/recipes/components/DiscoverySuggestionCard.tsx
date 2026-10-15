import {
  Clock3,
  Leaf,
  LoaderCircle,
  Plus,
  RotateCcw,
  Settings2,
  UtensilsCrossed,
} from "lucide-react";
import { useRecipeDiscoveryContext } from "../context/RecipeHomeContext";

export function DiscoverySuggestionCard() {
  const {
    currentSuggestion: recipe,
    diet,
    saving,
    saveSuggestion,
    advanceSuggestion,
    refineCriteria,
  } = useRecipeDiscoveryContext();

  if (!recipe) return null;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-bold tracking-tight">
            Découvrez des recettes
          </h1>
          <p className="mt-1 text-stone-500">Selon vos envies et vos critères.</p>
        </div>
        <button type="button" onClick={refineCriteria} className="secondary-button">
          <Settings2 size={16} /> Modifier les critères
        </button>
      </div>
      <article className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {recipe.imageDataUrl ? (
          <img
            src={recipe.imageDataUrl}
            alt={`Photo de ${recipe.name}`}
            className="h-64 w-full object-cover sm:h-80"
          />
        ) : (
          <div className="flex h-64 items-center justify-center bg-stone-200 text-sm text-stone-500 sm:h-80">
            Image indisponible
          </div>
        )}
        <div className="p-5 sm:p-6">
          <h2 className="font-serif text-3xl font-bold leading-tight">
            {recipe.name}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="criteria-chip">
              <Clock3 size={16} />
              {recipe.preparationTime + recipe.cookingTime} min
            </span>
            {diet && (
              <span className="criteria-chip bg-emerald-100 text-emerald-900">
                <Leaf size={16} />
                {diet}
              </span>
            )}
            <span className="criteria-chip">
              <UtensilsCrossed size={16} />
              Suggestion IA
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            {recipe.description || "Une recette à découvrir."}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={advanceSuggestion}
              disabled={saving}
              className="secondary-button"
            >
              <RotateCcw size={18} /> Une autre idée
            </button>
            <button
              type="button"
              onClick={saveSuggestion}
              disabled={saving}
              className="primary-button"
            >
              {saving ? (
                <LoaderCircle className="animate-spin" size={18} />
              ) : (
                <Plus size={18} />
              )}
              {saving ? "Ajout…" : "Ajouter au carnet"}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
