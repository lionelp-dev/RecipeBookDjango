import { LoaderCircle } from "lucide-react";

export function DiscoveryLoading() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center text-center">
      <LoaderCircle className="size-8 animate-spin text-stone-500" />
      <p className="mt-4 font-semibold">Création de votre sélection…</p>
      <p className="mt-1 text-sm text-stone-500">
        Les recettes et leurs images sont générées.
      </p>
    </div>
  );
}
