import { usePage } from "@inertiajs/react";
import { RecipeEditorPage } from "../../features/recipes/components/RecipeEditorPage";
import type { AppProps, Recipe } from "../../types";

export default function EditRecipe() {
  const { recipe, errors } = usePage<AppProps & { recipe: Recipe }>().props;
  return (
    <RecipeEditorPage
      currentPage="Modifier la recette"
      initialValues={recipe}
      submitLabel="Enregistrer les modifications"
      submittingLabel="Enregistrement…"
      errors={errors}
    />
  );
}
