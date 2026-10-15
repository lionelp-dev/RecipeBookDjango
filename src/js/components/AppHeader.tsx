import { Link } from "@inertiajs/react";
import { Plus, Sparkles, X } from "lucide-react";

type AppHeaderProps = {
  currentPage: string;
  onDiscover?: () => void;
  isDiscovering?: boolean;
};

export function AppHeader({ currentPage, onDiscover, isDiscovering = false }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 py-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <nav aria-label="Fil d’Ariane" className="min-w-0 text-sm">
          <ol className="flex flex-wrap items-center gap-2 text-stone-500">
            <li>
              <Link href="/" className="font-semibold transition hover:text-stone-950">
                Carnet de recettes
              </Link>
            </li>
            <li aria-hidden="true" className="text-stone-400">›</li>
            <li aria-current="page" className="font-semibold text-stone-900">{currentPage}</li>
          </ol>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {onDiscover ? (
            <button type="button" onClick={onDiscover} className="header-secondary-button hidden sm:inline-flex">
              {isDiscovering ? <X size={16} /> : <Sparkles size={16} />}
              {isDiscovering ? "Quitter la découverte" : "Découvrir avec l’IA"}
            </button>
          ) : (
            <Link href="/" className="header-secondary-button hidden sm:inline-flex"><Sparkles size={16} /> Mes recettes</Link>
          )}
          <Link href="/recipes/new" className="header-primary-button"><Plus size={16} /> <span className="hidden sm:inline">Nouvelle recette</span></Link>
        </div>
      </div>
    </header>
  );
}
