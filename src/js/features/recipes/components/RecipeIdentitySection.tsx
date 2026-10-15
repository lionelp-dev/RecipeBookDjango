import type { PageErrors } from "../../../types";
import type { RecipeFormController } from "../hooks/useRecipeForm";
import { FormField } from "./FormField";

type RecipeIdentitySectionProps = {
  form: RecipeFormController;
  errors: PageErrors;
  submitLabel: string;
};

export function RecipeIdentitySection({
  form,
  errors,
  submitLabel,
}: RecipeIdentitySectionProps) {
  return (
    <section className="form-card">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-950">
        {submitLabel}
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Les recettes sont visibles par toutes les personnes qui visitent ce carnet.
      </p>
      <div className="mt-6 space-y-5">
        <FormField label="Nom de la recette" error={errors.name}>
          <input
            value={form.state.name}
            onChange={(event) => form.updateField("name", event.target.value)}
            maxLength={100}
            className="text-input"
            placeholder="Entrez le nom de la recette"
            disabled={form.processing}
          />
        </FormField>
        <FormField label="Description" error={errors.description}>
          <textarea
            value={form.state.description}
            onChange={(event) =>
              form.updateField("description", event.target.value)
            }
            maxLength={1000}
            rows={5}
            className="text-input"
            placeholder="Décrivez votre recette"
            disabled={form.processing}
          />
        </FormField>
      </div>
    </section>
  );
}
