import { router } from "@inertiajs/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { csrfHeaders } from "../../../lib/csrf";
import type { DiscoveredRecipe, DiscoveryPool } from "../../../types";
import type { RecipeHomeProps } from "../types";

type UseRecipeDiscoveryOptions = {
  onRecipeSaved: (recipeId: number) => void;
};

export function useRecipeDiscovery({
  onRecipeSaved,
}: UseRecipeDiscoveryOptions) {
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState<string | null>(null);
  const [diet, setDiet] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<DiscoveredRecipe[]>([]);
  const [generating, setGenerating] = useState(false);
  const [prefetching, setPrefetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);
  const swipes = useRef(0);
  const poolInFlight = useRef(false);

  const currentSuggestion = suggestions[0] ?? null;

  const requestPool = useCallback(
    (prefetch: boolean) => {
      if (poolInFlight.current || prompt.trim().length < 3) return;

      poolInFlight.current = true;
      setDiscoveryError(null);
      if (prefetch) setPrefetching(true);
      else setGenerating(true);

      router.post(
        "/recipes/discover/pool",
        { prompt: prompt.trim() },
        {
          async: true,
          preserveState: true,
          preserveScroll: true,
          preserveUrl: true,
          only: ["discoveryPool", "discoveryError"],
          headers: csrfHeaders(),
          onSuccess: (page) => {
            const result = page.props as unknown as Pick<
              RecipeHomeProps,
              "discoveryPool" | "discoveryError"
            >;
            if (result.discoveryError) {
              setDiscoveryError(result.discoveryError);
              return;
            }
            if (!result.discoveryPool) {
              setDiscoveryError("Le serveur n’a retourné aucune suggestion.");
              return;
            }

            const pool: DiscoveryPool = result.discoveryPool;
            if (prefetch) {
              setSuggestions((current) => [...current, ...pool.recipes]);
            } else {
              setSuggestions(pool.recipes);
              swipes.current = 0;
            }
            if (pool.failedRecipeCount) {
              toast.message(
                `${pool.failedRecipeCount} proposition(s) n’ont pas pu être générées.`,
              );
            }
          },
          onError: () => setDiscoveryError("La génération des recettes a échoué."),
          onFinish: () => {
            poolInFlight.current = false;
            setGenerating(false);
            setPrefetching(false);
          },
        },
      );
    },
    [prompt],
  );

  const advanceSuggestion = useCallback(() => {
    const last = suggestions.length === 1;
    setSuggestions((current) => current.slice(1));
    const count = swipes.current + 1;
    if (count === 5 || last) requestPool(true);
    swipes.current = count === 10 ? 0 : count;
  }, [requestPool, suggestions.length]);

  const toggleDiscovery = useCallback(() => {
    if (isDiscovering || isPaused) {
      if (
        (prompt || suggestions.length) &&
        !window.confirm(
          "Quitter la découverte abandonnera vos critères et suggestions. Continuer ?",
        )
      ) {
        return;
      }
      setIsDiscovering(false);
      setIsPaused(false);
      setSuggestions([]);
      setPrompt("");
      setDiscoveryError(null);
      return;
    }

    setIsDiscovering(true);
  }, [isDiscovering, isPaused, prompt, suggestions.length]);

  const pauseForRecipeSelection = useCallback(() => {
    if (!isDiscovering) return;

    setIsDiscovering(false);
    setIsPaused(true);
  }, [isDiscovering]);

  const resume = useCallback(() => {
    setIsPaused(false);
    setIsDiscovering(true);
  }, []);

  const saveSuggestion = useCallback(() => {
    if (!currentSuggestion || saving) return;

    setSaving(true);
    setDiscoveryError(null);
    const {
      imageDataUrl,
      imageGenerationFailed: _imageGenerationFailed,
      ...recipe
    } = currentSuggestion;
    router.post(
      "/recipes/discover/save",
      { recipe, imageDataUrl },
      {
        async: true,
        preserveState: true,
        preserveScroll: true,
        preserveUrl: true,
        only: ["savedRecipeId", "saveError"],
        headers: csrfHeaders(),
        onSuccess: (page) => {
          const result = page.props as unknown as Pick<
            RecipeHomeProps,
            "savedRecipeId" | "saveError"
          >;
          if (result.saveError) {
            setDiscoveryError(result.saveError);
            return;
          }
          if (!result.savedRecipeId) {
            setDiscoveryError("La recette n’a pas pu être sauvegardée.");
            return;
          }

          toast.success(
            `« ${currentSuggestion.name} » a été ajoutée à vos recettes.`,
          );
          onRecipeSaved(result.savedRecipeId);
          advanceSuggestion();
        },
        onError: () => setDiscoveryError("La recette n’a pas pu être sauvegardée."),
        onFinish: () => setSaving(false),
      },
    );
  }, [advanceSuggestion, currentSuggestion, onRecipeSaved, saving]);

  return {
    isDiscovering,
    isPaused,
    prompt,
    duration,
    diet,
    style,
    currentSuggestion,
    suggestions,
    generating,
    prefetching,
    saving,
    discoveryError,
    setPrompt,
    setDuration,
    setDiet,
    setStyle,
    toggleDiscovery,
    pauseForRecipeSelection,
    resume,
    generate: () => requestPool(false),
    retry: () => requestPool(true),
    advanceSuggestion,
    saveSuggestion,
    refineCriteria: () => setSuggestions([]),
  };
}
