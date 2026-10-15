import { Sparkles } from "lucide-react";
import { useRecipeDiscoveryContext } from "../context/RecipeHomeContext";

export function DiscoveryPausedBanner() {
  const { resume } = useRecipeDiscoveryContext();

  return (
    <button
      type="button"
      onClick={resume}
      className="flex shrink-0 items-center justify-between gap-4 border-b border-stone-200 bg-stone-100 px-5 py-3 text-left text-sm hover:bg-stone-200"
    >
      <span>
        <Sparkles className="mr-2 inline text-amber-800" size={18} />
        Mode découverte en pause — votre suggestion est conservée.
      </span>
      <span className="font-semibold underline">Reprendre</span>
    </button>
  );
}
