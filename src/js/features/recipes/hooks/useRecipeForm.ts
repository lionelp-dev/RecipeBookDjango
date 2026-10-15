import { router } from "@inertiajs/react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type RefObject,
} from "react";
import { csrfHeaders } from "../../../lib/csrf";
import type {
  IngredientFormValue,
  RecipeFormState,
  RecipeFormValues,
  RecipeStepFormValue,
} from "../types";

type RecipeField = "name" | "description" | "preparationTime" | "cookingTime";
type IngredientField = "name" | "quantity" | "unit";

export type RecipeFormController = {
  state: RecipeFormState;
  processing: boolean;
  imageInputRef: RefObject<HTMLInputElement | null>;
  updateField: (field: RecipeField, value: string) => void;
  updateIngredient: (
    index: number,
    field: IngredientField,
    value: string,
  ) => void;
  addIngredient: () => void;
  removeIngredient: (index: number) => void;
  updateStep: (index: number, instruction: string) => void;
  addStep: () => void;
  removeStep: (index: number) => void;
  selectImage: (event: ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
};

const createKey = () => crypto.randomUUID();

export function useRecipeForm(initialValues: RecipeFormValues): RecipeFormController {
  const [name, setName] = useState(initialValues.name);
  const [description, setDescription] = useState(initialValues.description ?? "");
  const [preparationTime, setPreparationTime] = useState(
    String(initialValues.preparationTime),
  );
  const [cookingTime, setCookingTime] = useState(String(initialValues.cookingTime));
  const [ingredients, setIngredients] = useState<IngredientFormValue[]>(() =>
    initialValues.ingredients.map((ingredient) => ({
      ...ingredient,
      key: createKey(),
    })),
  );
  const [steps, setSteps] = useState<RecipeStepFormValue[]>(() =>
    initialValues.steps.map((step) => ({ ...step, key: createKey() })),
  );
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    initialValues.imageUrl,
  );
  const [removeImage, setRemoveImage] = useState(false);
  const [processing, setProcessing] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      if (imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    },
    [imagePreviewUrl],
  );

  function updateField(field: RecipeField, value: string) {
    if (field === "name") setName(value);
    else if (field === "description") setDescription(value);
    else if (field === "preparationTime") setPreparationTime(value);
    else setCookingTime(value);
  }

  function updateIngredient(index: number, field: IngredientField, value: string) {
    setIngredients((current) =>
      current.map((ingredient, currentIndex) => {
        if (currentIndex !== index) return ingredient;
        if (field === "quantity") return { ...ingredient, quantity: Number(value) };
        if (field === "unit") return { ...ingredient, unit: value || null };
        return { ...ingredient, name: value };
      }),
    );
  }

  function addIngredient() {
    setIngredients((current) => [
      ...current,
      { key: createKey(), name: "", quantity: 1, unit: null },
    ]);
  }

  function removeIngredient(index: number) {
    setIngredients((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  function updateStep(index: number, instruction: string) {
    setSteps((current) =>
      current.map((step, currentIndex) =>
        currentIndex === index ? { ...step, instruction } : step,
      ),
    );
  }

  function addStep() {
    setSteps((current) => [
      ...current,
      { key: createKey(), instruction: "" },
    ]);
  }

  function removeStep(index: number) {
    setSteps((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;

    setImage(selected);
    setImagePreviewUrl(URL.createObjectURL(selected));
    setRemoveImage(false);
  }

  function clearImage() {
    if (imageInputRef.current) imageInputRef.current.value = "";
    setImage(null);
    setImagePreviewUrl(null);
    setRemoveImage(Boolean(initialValues.imageUrl));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (processing) return;

    const data = new FormData();
    data.append(
      "recipe",
      JSON.stringify({
        name,
        description,
        preparationTime,
        cookingTime,
        ingredients: ingredients.map(({ name, quantity, unit }) => ({ name, quantity, unit })),
        steps: steps.map(({ instruction }) => ({ instruction })),
      }),
    );
    if (image) data.append("image", image);
    if (removeImage) data.append("removeImage", "true");

    const options = {
      headers: csrfHeaders(),
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
      preserveScroll: true,
    };

    const url = initialValues.id ? `/recipes/${initialValues.id}` : "/recipes";
    router.post(url, data, options);
  }

  return {
    state: {
      name,
      description,
      preparationTime,
      cookingTime,
      ingredients,
      steps,
      imagePreviewUrl,
    },
    processing,
    imageInputRef,
    updateField,
    updateIngredient,
    addIngredient,
    removeIngredient,
    updateStep,
    addStep,
    removeStep,
    selectImage,
    clearImage,
    submit,
  };
}
