import { Plus, Trash2 } from "lucide-react";
import type { PageErrors } from "../../../types";
import type { RecipeFormController } from "../hooks/useRecipeForm";
import { FormField } from "./FormField";

type RecipeIngredientsSectionProps = {
  form: RecipeFormController;
  errors: PageErrors;
};

export function RecipeIngredientsSection({
  form,
  errors,
}: RecipeIngredientsSectionProps) {
  const { ingredients } = form.state;

  return (
    <section className="form-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="section-title">Ingrédients</h2>
        <button
          type="button"
          onClick={form.addIngredient}
          disabled={form.processing}
          className="small-secondary-button"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>
      {ingredients.length === 0 ? (
        <p className="empty-inline">Aucun ingrédient pour le moment.</p>
      ) : (
        <div className="mt-5 space-y-4">
          {ingredients.map((ingredient, index) => (
            <div
              key={ingredient.key}
              className="grid gap-3 rounded-lg bg-stone-50 p-3 md:grid-cols-[minmax(0,1fr)_7rem_8rem_auto] md:items-end"
            >
              <FormField
                label="Nom"
                error={errors[`ingredients.${index}.name`]}
              >
                <input
                  value={ingredient.name}
                  onChange={(event) =>
                    form.updateIngredient(index, "name", event.target.value)
                  }
                  className="text-input"
                  disabled={form.processing}
                />
              </FormField>
              <FormField
                label="Quantité"
                error={errors[`ingredients.${index}.quantity`]}
              >
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={String(ingredient.quantity)}
                  onChange={(event) =>
                    form.updateIngredient(index, "quantity", event.target.value)
                  }
                  className="text-input"
                  disabled={form.processing}
                />
              </FormField>
              <FormField
                label="Unité"
                error={errors[`ingredients.${index}.unit`]}
              >
                <input
                  value={ingredient.unit ?? ""}
                  onChange={(event) =>
                    form.updateIngredient(index, "unit", event.target.value)
                  }
                  maxLength={50}
                  className="text-input"
                  placeholder="g, ml…"
                  disabled={form.processing}
                />
              </FormField>
              <button
                type="button"
                aria-label={`Supprimer l’ingrédient ${index + 1}`}
                onClick={() => form.removeIngredient(index)}
                disabled={form.processing}
                className="delete-icon-button"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
