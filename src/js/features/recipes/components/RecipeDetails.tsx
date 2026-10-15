import { Link } from "@inertiajs/react";
import { Clock3, Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import { useRecipeCollectionContext } from "../context/RecipeHomeContext";

export function RecipeDetails() {
  const { selectedRecipe: recipe, deleteRecipe } = useRecipeCollectionContext();

  if (!recipe) {
    return (
      <section className="order-1 flex min-h-64 items-center justify-center px-6 py-12 text-center">
        <div>
          <p className="text-lg font-semibold">Choisissez une recette</p>
          <p className="mt-2 text-sm text-stone-500">
            Sélectionnez une recette dans votre carnet pour voir ses détails.
          </p>
        </div>
      </section>
    );
  }

  return (
    <aside className="order-1 min-h-0 overflow-y-auto bg-white px-6 py-5 sm:px-10">
      <div className="mx-auto w-full max-w-3xl">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={`Photo de ${recipe.name}`}
            className="h-48 w-full rounded-xl object-cover shadow-sm sm:h-56"
          />
        ) : (
          <div className="h-48 rounded-xl bg-stone-200 sm:h-56" />
        )}
        <h1 className="mt-5 font-serif text-3xl font-bold tracking-tight">
          {recipe.name}
        </h1>
        <dl className="mt-3 flex flex-wrap gap-5 text-sm text-stone-500">
          <div className="flex items-center gap-2">
            <Clock3 size={16} />
            {recipe.preparationTime + recipe.cookingTime} min
          </div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={16} />
            {recipe.ingredients.length} ingrédient
            {recipe.ingredients.length === 1 ? "" : "s"}
          </div>
        </dl>
        <p className="mt-5 text-sm leading-6 text-stone-600">
          {recipe.description || "Aucune description disponible."}
        </p>
        <section className="mt-6 border-t border-stone-200 pt-5">
          <h2 className="section-title">Ingrédients</h2>
          {recipe.ingredients.length ? (
            <ul className="mt-3 space-y-1.5">
              {recipe.ingredients.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="flex justify-between gap-4 rounded-md px-1 py-1.5 text-sm text-stone-600"
                >
                  <span>{ingredient.name}</span>
                  <span className="shrink-0">
                    {new Intl.NumberFormat("fr-FR", {
                      maximumFractionDigits: 2,
                    }).format(ingredient.quantity)}
                    {ingredient.unit ? ` ${ingredient.unit}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-inline">Aucun ingrédient pour le moment.</p>
          )}
        </section>
        <section className="mt-6 border-t border-stone-200 pt-5">
          <h2 className="section-title">Préparation</h2>
          {recipe.steps.length ? (
            <ol className="mt-4 space-y-3">
              {recipe.steps.map((step, index) => (
                <li
                  key={step.id}
                  className="flex gap-3 text-sm leading-6 text-stone-600"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold">
                    {index + 1}
                  </span>
                  <span>{step.instruction}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty-inline">Aucune étape pour le moment.</p>
          )}
        </section>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Supprimer la recette « ${recipe.name} » ?`)) {
                deleteRecipe(recipe);
              }
            }}
            className="delete-button"
          >
            <Trash2 size={16} /> Supprimer
          </button>
          <Link href={`/recipes/${recipe.id}/edit`} className="secondary-button">
            <Pencil size={16} /> Modifier
          </Link>
        </div>
      </div>
    </aside>
  );
}
