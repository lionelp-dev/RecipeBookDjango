import { RecipeHomeLayout } from "../features/recipes/components/RecipeHomeLayout";
import { RecipeHomeProvider } from "../features/recipes/context/RecipeHomeContext";
import type { RecipeHomeProps } from "../features/recipes/types";

export default function Home(props: RecipeHomeProps) {
  return (
    <RecipeHomeProvider initialData={props}>
      <RecipeHomeLayout />
    </RecipeHomeProvider>
  );
}
