import { Link } from "@inertiajs/react";
import { ImagePlus, X } from "lucide-react";
import type { PageErrors } from "../../../types";
import type { RecipeFormController } from "../hooks/useRecipeForm";

type RecipeImageSectionProps = {
  form: RecipeFormController;
  errors: PageErrors;
  submitLabel: string;
  submittingLabel: string;
};

export function RecipeImageSection({
  form,
  errors,
  submitLabel,
  submittingLabel,
}: RecipeImageSectionProps) {
  const { imagePreviewUrl } = form.state;

  return (
    <aside className="form-card lg:sticky lg:top-20">
      <h2 className="section-title">Image de la recette</h2>
      <p className="mt-2 text-sm text-stone-500">
        JPEG, PNG ou WebP · 5 Mo maximum
      </p>
      {imagePreviewUrl ? (
        <div className="relative mt-5">
          <img
            src={imagePreviewUrl}
            alt="Aperçu de la recette"
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={form.clearImage}
            className="absolute right-3 top-3 rounded-full bg-white p-2 text-stone-700 shadow"
            aria-label="Retirer l’image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="image-dropzone">
          <ImagePlus size={24} />
          <span>Aucune image sélectionnée</span>
          <span className="text-xs">Choisir une image</span>
          <input
            ref={form.imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={form.selectImage}
            className="sr-only"
          />
        </label>
      )}
      {imagePreviewUrl && (
        <label className="mt-4 block cursor-pointer text-center text-sm font-semibold text-stone-700 underline underline-offset-4">
          Changer l’image
          <input
            ref={form.imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={form.selectImage}
            className="sr-only"
          />
        </label>
      )}
      {errors.image && <p className="field-error">{errors.image}</p>}
      <div className="mt-7 flex flex-col gap-3">
        <button
          type="submit"
          disabled={form.processing}
          className="primary-button w-full"
        >
          {form.processing ? submittingLabel : submitLabel}
        </button>
        <Link href="/" className="secondary-button w-full">
          Annuler
        </Link>
      </div>
    </aside>
  );
}
