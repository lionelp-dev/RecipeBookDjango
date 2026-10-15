import { AppHeader } from "../../../components/AppHeader";
import { useRecipeDiscoveryContext } from "../context/RecipeHomeContext";

export function RecipeHomeHeader() {
  const { isDiscovering, isPaused, toggleDiscovery } =
    useRecipeDiscoveryContext();

  return (
    <AppHeader
      currentPage="Mes recettes"
      onDiscover={toggleDiscovery}
      isDiscovering={isDiscovering || isPaused}
    />
  );
}
