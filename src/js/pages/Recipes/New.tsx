import { usePage } from "@inertiajs/react";
import { RecipeEditorPage } from "../../features/recipes/components/RecipeEditorPage";
import type { AppProps } from "../../types";

export default function NewRecipe() {
  const { errors } = usePage<AppProps>().props;
  return (
    <RecipeEditorPage
      currentPage="Nouvelle recette"
      initialValues={{
        name: "",
        description: null,
        preparationTime: 0,
        cookingTime: 0,
        imageUrl: null,
        ingredients: [],
        steps: [],
      }}
      submitLabel="Créer la recette"
      submittingLabel="Enregistrement…"
      errors={errors}
    />
  );
}
