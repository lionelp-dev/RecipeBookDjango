import { Sparkles } from "lucide-react";
import { useRecipeDiscoveryContext } from "../context/RecipeHomeContext";
import { PreferenceChip } from "./PreferenceChip";
import { PreferenceGroup } from "./PreferenceGroup";

const durationOptions = ["15 min", "30 min", "1 h", "Peu importe"];
const dietOptions = [
  "Végétarien",
  "Végan",
  "Sans gluten",
  "Sans produits laitiers",
];
const styleOptions = [
  "Équilibré",
  "Cuisine du monde",
  "Repas familial",
  "Plats réconfortants",
  "Recettes légères",
];

export function DiscoveryCriteriaForm() {
  const {
    prompt,
    duration,
    diet,
    style,
    setPrompt,
    setDuration,
    setDiet,
    setStyle,
    generate,
  } = useRecipeDiscoveryContext();

  return (
    <div>
      <div className="flex items-end gap-4">
        <span className="rounded-2xl bg-amber-100 p-3 text-amber-800">
          <Sparkles size={24} />
        </span>
        <h1 className="font-serif text-4xl font-bold tracking-tight">
          Découvrir des recettes avec l’IA
        </h1>
      </div>
      <p className="mt-3 text-stone-500">
        Explorez de nouvelles idées et ajoutez seulement celles qui vous plaisent.
      </p>
      <div className="mt-8">
        <label className="text-sm font-semibold">
          Qu’avez-vous envie de manger ?
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            maxLength={5000}
            rows={5}
            className="text-input mt-2 resize-none"
            placeholder="Un dîner végétarien gourmand, un plat rapide pour la semaine…"
          />
        </label>
        <PreferenceGroup label="Durée maximale">
          {durationOptions.map((option) => (
            <PreferenceChip
              key={option}
              selected={duration === option}
              onClick={() =>
                setDuration(duration === option ? null : option)
              }
            >
              {option}
            </PreferenceChip>
          ))}
        </PreferenceGroup>
        <PreferenceGroup label="Alimentation">
          {dietOptions.map((option) => (
            <PreferenceChip
              key={option}
              selected={diet === option}
              onClick={() => setDiet(diet === option ? null : option)}
            >
              {option}
            </PreferenceChip>
          ))}
        </PreferenceGroup>
        <PreferenceGroup label="Style">
          {styleOptions.map((option) => (
            <PreferenceChip
              key={option}
              selected={style === option}
              onClick={() => setStyle(style === option ? null : option)}
            >
              {option}
            </PreferenceChip>
          ))}
        </PreferenceGroup>
        <button
          type="button"
          onClick={generate}
          disabled={prompt.trim().length < 3}
          className="primary-button mt-5 w-full"
        >
          <Sparkles size={18} /> Générer des idées
        </button>
        <p className="mt-4 text-center text-sm text-stone-500">
          Aucune recette ne sera ajoutée automatiquement.
        </p>
      </div>
    </div>
  );
}
