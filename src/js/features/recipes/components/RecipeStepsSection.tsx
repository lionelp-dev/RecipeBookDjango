import { Plus, Trash2 } from "lucide-react";
import type { PageErrors } from "../../../types";
import type { RecipeFormController } from "../hooks/useRecipeForm";

type RecipeStepsSectionProps = {
  form: RecipeFormController;
  errors: PageErrors;
};

export function RecipeStepsSection({ form, errors }: RecipeStepsSectionProps) {
  const { steps } = form.state;

  return (
    <section className="form-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="section-title">Étapes</h2>
        <button
          type="button"
          onClick={form.addStep}
          disabled={form.processing}
          className="small-secondary-button"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>
      {steps.length === 0 ? (
        <p className="empty-inline">Aucune étape pour le moment.</p>
      ) : (
        <div className="mt-5 space-y-4">
          {steps.map((step, index) => (
            <div key={step.key} className="flex gap-3">
              <span className="mt-2.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-600">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <textarea
                  value={step.instruction}
                  onChange={(event) =>
                    form.updateStep(index, event.target.value)
                  }
                  rows={3}
                  maxLength={2000}
                  className="text-input"
                  disabled={form.processing}
                />
                {errors[`steps.${index}.instruction`] && (
                  <p className="field-error">
                    {errors[`steps.${index}.instruction`]}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label={`Supprimer l’étape ${index + 1}`}
                onClick={() => form.removeStep(index)}
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
