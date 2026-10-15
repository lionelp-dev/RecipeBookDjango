import type {
  AppProps,
  DiscoveryPool,
  Ingredient,
  Recipe,
  RecipeStep,
} from "../../types";

export type RecipeFormValues = {
  id?: number;
  name: string;
  description: string | null;
  preparationTime: number | string;
  cookingTime: number | string;
  imageUrl: string | null;
  ingredients: Ingredient[];
  steps: RecipeStep[];
};

export type IngredientFormValue = Omit<Ingredient, "id" | "position"> & {
  key: string;
};

export type RecipeStepFormValue = Omit<RecipeStep, "id" | "position"> & {
  key: string;
};

export type RecipeFormState = {
  name: string;
  description: string;
  preparationTime: string;
  cookingTime: string;
  ingredients: IngredientFormValue[];
  steps: RecipeStepFormValue[];
  imagePreviewUrl: string | null;
};

export type RecipeHomeProps = AppProps & {
  recipes: Recipe[];
  totalItems: number;
  currentPage: number;
  lastPage: number;
  discoveryPool?: DiscoveryPool;
  discoveryError?: string;
  savedRecipeId?: number;
  saveError?: string;
};
