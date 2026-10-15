import { LoaderCircle } from "lucide-react";
import { useRecipeDiscoveryContext } from "../context/RecipeHomeContext";
import { DiscoveryCriteriaForm } from "./DiscoveryCriteriaForm";
import { DiscoveryLoading } from "./DiscoveryLoading";
import { DiscoverySuggestionCard } from "./DiscoverySuggestionCard";

export function DiscoveryPanel() {
  const {
    prompt,
    currentSuggestion,
    suggestions,
    generating,
    prefetching,
    discoveryError,
    retry,
  } = useRecipeDiscoveryContext();

  return (
    <section className="order-1 min-h-0 overflow-y-auto bg-[#fcfbf8] px-6 py-6 sm:px-10">
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col">
        {!currentSuggestion && !generating && !prefetching && (
          <DiscoveryCriteriaForm />
        )}
        {(generating || (!currentSuggestion && prefetching)) && (
          <DiscoveryLoading />
        )}
        {currentSuggestion && (
          <DiscoverySuggestionCard />
        )}
        {!currentSuggestion &&
          !generating &&
          !prefetching &&
          suggestions.length === 0 &&
          prompt && (
            <button
              type="button"
              onClick={retry}
              className="secondary-button mt-6"
            >
              Réessayer
            </button>
          )}
        {prefetching && currentSuggestion && (
          <p className="mt-4 flex items-center gap-2 text-sm text-stone-500">
            <LoaderCircle className="animate-spin" size={16} /> Préparation d’autres
            idées…
          </p>
        )}
        {discoveryError && (
          <p role="alert" className="mt-5 text-sm font-semibold text-red-700">
            {discoveryError}
          </p>
        )}
      </div>
    </section>
  );
}
