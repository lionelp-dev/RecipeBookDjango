import { AppHeader } from "../../../components/AppHeader";
import type { PageErrors } from "../../../types";
import type { RecipeFormValues } from "../types";
import { RecipeForm } from "./RecipeForm";

type RecipeEditorPageProps = {
  currentPage: string;
  initialValues: RecipeFormValues;
  submitLabel: string;
  submittingLabel: string;
  errors?: PageErrors;
};

export function RecipeEditorPage({
  currentPage,
  initialValues,
  submitLabel,
  submittingLabel,
  errors,
}: RecipeEditorPageProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <AppHeader currentPage={currentPage} />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <RecipeForm
          initialValues={initialValues}
          submitLabel={submitLabel}
          submittingLabel={submittingLabel}
          errors={errors}
        />
      </main>
    </div>
  );
}
