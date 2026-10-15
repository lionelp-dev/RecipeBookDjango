import { useRecipeDiscoveryContext } from "../context/RecipeHomeContext";
import { DiscoveryPanel } from "./DiscoveryPanel";
import { DiscoveryPausedBanner } from "./DiscoveryPausedBanner";
import { RecipeDetails } from "./RecipeDetails";
import { RecipeHomeHeader } from "./RecipeHomeHeader";
import { RecipeList } from "./RecipeList";

export function RecipeHomeLayout() {
  const { isDiscovering, isPaused } = useRecipeDiscoveryContext();

  return (
    <div className="h-[100dvh] overflow-hidden bg-stone-50 text-stone-950">
      <RecipeHomeHeader />
      <main className="mx-auto flex h-[calc(100dvh-4.125rem)] min-h-0 w-full max-w-7xl px-4 sm:px-6">
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white shadow-sm">
          {isPaused && <DiscoveryPausedBanner />}
          <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1.12fr)_minmax(17rem,.88fr)]">
            {isDiscovering ? <DiscoveryPanel /> : <RecipeDetails />}
            <RecipeList />
          </div>
        </section>
      </main>
    </div>
  );
}
