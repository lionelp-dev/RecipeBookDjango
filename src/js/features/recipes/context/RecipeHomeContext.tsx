import {
  createContext,
  useContext,
  type Context,
  type ReactNode,
} from "react";
import { useRecipeHome } from "../hooks/useRecipeHome";
import type { RecipeHomeProps } from "../types";

type RecipeHomeState = ReturnType<typeof useRecipeHome>;
type RecipeCollectionState = RecipeHomeState["collection"];
type RecipeDiscoveryState = RecipeHomeState["discovery"];
type SelectRecipe = RecipeHomeState["selectRecipe"];

const RecipeCollectionContext = createContext<RecipeCollectionState | null>(null);
const RecipeDiscoveryContext = createContext<RecipeDiscoveryState | null>(null);
const RecipeSelectionContext = createContext<SelectRecipe | null>(null);

type RecipeHomeProviderProps = {
  initialData: RecipeHomeProps;
  children: ReactNode;
};

export function RecipeHomeProvider({
  initialData,
  children,
}: RecipeHomeProviderProps) {
  const { collection, discovery, selectRecipe } = useRecipeHome(initialData);

  return (
    <RecipeCollectionContext.Provider value={collection}>
      <RecipeDiscoveryContext.Provider value={discovery}>
        <RecipeSelectionContext.Provider value={selectRecipe}>
          {children}
        </RecipeSelectionContext.Provider>
      </RecipeDiscoveryContext.Provider>
    </RecipeCollectionContext.Provider>
  );
}

export function useRecipeCollectionContext() {
  return useRequiredContext(RecipeCollectionContext, "RecipeCollectionContext");
}

export function useRecipeDiscoveryContext() {
  return useRequiredContext(RecipeDiscoveryContext, "RecipeDiscoveryContext");
}

export function useRecipeSelectionContext() {
  return useRequiredContext(RecipeSelectionContext, "RecipeSelectionContext");
}

function useRequiredContext<T>(context: Context<T | null>, name: string): T {
  const value = useContext(context);
  if (value === null) {
    throw new Error(`${name} must be used within RecipeHomeProvider.`);
  }

  return value;
}
