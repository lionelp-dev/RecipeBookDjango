import type { PageErrors } from "../../../types";
import { useRecipeForm } from "../hooks/useRecipeForm";
import type { RecipeFormValues } from "../types";
import { RecipeIdentitySection } from "./RecipeIdentitySection";
import { RecipeImageSection } from "./RecipeImageSection";
import { RecipeIngredientsSection } from "./RecipeIngredientsSection";
import { RecipeStepsSection } from "./RecipeStepsSection";
import { RecipeTimingSection } from "./RecipeTimingSection";

type RecipeFormProps = {
  initialValues: RecipeFormValues;
  submitLabel: string;
  submittingLabel: string;
  errors?: PageErrors;
};

export function RecipeForm({
  initialValues,
  submitLabel,
  submittingLabel,
  errors = {},
}: RecipeFormProps) {
  const form = useRecipeForm(initialValues);

  return (
    <form onSubmit={form.submit} className="mx-auto max-w-6xl pb-10">
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:gap-6">
        <div className="space-y-5">
          <RecipeIdentitySection
            form={form}
            errors={errors}
            submitLabel={submitLabel}
          />
          <RecipeTimingSection form={form} errors={errors} />
          <RecipeIngredientsSection form={form} errors={errors} />
          <RecipeStepsSection form={form} errors={errors} />
        </div>
        <RecipeImageSection
          form={form}
          errors={errors}
          submitLabel={submitLabel}
          submittingLabel={submittingLabel}
        />
      </div>
    </form>
  );
}
