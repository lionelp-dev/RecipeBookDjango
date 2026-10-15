export type Ingredient = {
  id?: number;
  name: string;
  quantity: number;
  unit: string | null;
  position?: number;
};

export type RecipeStep = {
  id?: number;
  instruction: string;
  position?: number;
};

export type Recipe = {
  id: number;
  name: string;
  description: string | null;
  preparationTime: number;
  cookingTime: number;
  imageUrl: string | null;
  imageGenerationStatus: "not_requested" | "pending" | "ready" | "failed";
  ingredients: Ingredient[];
  steps: RecipeStep[];
};

export type DiscoveredRecipe = Omit<Recipe, "id" | "imageUrl" | "imageGenerationStatus"> & {
  imageDataUrl: string | null;
  imageGenerationFailed: boolean;
};

export type DiscoveryPool = {
  recipes: DiscoveredRecipe[];
  failedRecipeCount: number;
};

export type PageErrors = Record<string, string>;

export type FlashMessage = {
  level: string;
  message: string;
};

export type AppProps = {
  errors?: PageErrors;
};
