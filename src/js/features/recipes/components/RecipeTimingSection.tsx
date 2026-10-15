import type { PageErrors } from "../../../types";
import type { RecipeFormController } from "../hooks/useRecipeForm";
import { FormField } from "./FormField";

type RecipeTimingSectionProps = {
  form: RecipeFormController;
  errors: PageErrors;
};

export function RecipeTimingSection({ form, errors }: RecipeTimingSectionProps) {
  return (
    <section className="form-card">
      <h2 className="section-title">Détails de la recette</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <FormField label="Préparation (minutes)" error={errors.preparationTime}>
          <input
            type="number"
            min="0"
            step="1"
            value={form.state.preparationTime}
            onChange={(event) =>
              form.updateField("preparationTime", event.target.value)
            }
            className="text-input"
            disabled={form.processing}
          />
        </FormField>
        <FormField label="Cuisson (minutes)" error={errors.cookingTime}>
          <input
            type="number"
            min="0"
            step="1"
            value={form.state.cookingTime}
            onChange={(event) =>
              form.updateField("cookingTime", event.target.value)
            }
            className="text-input"
            disabled={form.processing}
          />
        </FormField>
      </div>
    </section>
  );
}
