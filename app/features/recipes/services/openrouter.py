from __future__ import annotations

import base64
import binascii
import json
import os
import urllib.error
import urllib.request
from typing import Any, cast

from langchain_openai import ChatOpenAI
from pydantic import SecretStr

from ..schemas import GeneratedRecipe, GeneratedRecipeName, generated_recipe_from_data
from ..validation import validate_recipe_data

MAX_IMAGE_SIZE = 5 * 1024 * 1024


class OpenRouterRecipeGenerator:
    def __init__(self) -> None:
        self.api_key = os.environ.get("OPENROUTER_API_KEY", "").strip()
        self.base_url = os.environ.get("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1").rstrip("/")
        self.text_model = os.environ.get("OPENROUTER_MODEL", "openai/gpt-4o-mini")

    def is_configured(self) -> bool:
        return bool(self.api_key)

    def _model(self) -> ChatOpenAI:
        return ChatOpenAI(
            model=self.text_model,
            api_key=SecretStr(self.api_key),
            base_url=self.base_url,
            temperature=0.8,
            timeout=60,
            max_retries=0,
        )

    def generate_name(self, prompt: str) -> str:
        model = self._model().with_structured_output(
            GeneratedRecipeName, method="json_schema", strict=True
        )
        generated = cast(
            GeneratedRecipeName,
            model.invoke(
                [
                    (
                        "system",
                        "Tu es un chef cuisinier expert. Propose uniquement un nom de recette réaliste, varié et explicite.",
                    ),
                    (
                        "human",
                        f"Demande utilisateur : {prompt}\n\nPropose un nom de recette.",
                    ),
                ]
            ),
        )
        return generated.name

    def generate_recipe(self, prompt: str, recipe_name: str) -> GeneratedRecipe:
        model = self._model().with_structured_output(
            GeneratedRecipe, method="json_schema", strict=True
        )
        generated = cast(
            GeneratedRecipe,
            model.invoke(
                [
                    (
                        "system",
                        "Tu es un chef cuisinier expert. Génère des recettes réalistes, variées et directement exploitables. "
                        "Chaque recette doit avoir des quantités cohérentes, des durées en minutes, et au moins une étape claire. "
                        "Ne génère ni catégories, ni tags, ni portions, ni moments de repas.",
                    ),
                    (
                        "human",
                        f"Demande utilisateur : {prompt}\n\nGénère la recette complète dont le nom doit être exactement : {recipe_name}.",
                    ),
                ]
            ),
        )
        generated = generated_recipe_from_data(
            validate_recipe_data(generated.model_dump(mode="python"), generated=True)
        )
        if generated.name != recipe_name:
            raise ValueError("Le nom généré ne correspond pas au nom demandé.")
        return generated


class OpenRouterRecipeImageGenerator:
    def __init__(self) -> None:
        self.api_key = os.environ.get("OPENROUTER_API_KEY", "").strip()
        self.base_url = os.environ.get("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1").rstrip("/")
        self.image_model = os.environ.get("OPENROUTER_IMAGE_MODEL", "openai/gpt-image-2")

    def generate(self, recipe_name: str) -> str | None:
        if not self.api_key:
            return None
        try:
            payload = self._request_json(
                f"{self.base_url}/images/generations",
                {
                    "model": self.image_model,
                    "prompt": f"Professional food photography of {recipe_name}, appetizing, well-lit, realistic, no text or watermark",
                    "n": 1,
                    "size": "1024x640",
                    "quality": "low",
                    "output_format": "jpeg",
                },
            )
            encoded = payload.get("data", [{}])[0].get("b64_json")
            if not isinstance(encoded, str):
                return None
            content = base64.b64decode(encoded, validate=True)
            if not content or len(content) > MAX_IMAGE_SIZE:
                return None
            return f"data:image/jpeg;base64,{encoded}"
        except (OpenRouterError, ValueError, TypeError, binascii.Error, IndexError):
            return None

    def _request_json(self, url: str, payload: dict[str, Any]) -> dict[str, Any]:
        request = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                parsed = json.loads(response.read().decode("utf-8"))
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as error:
            raise OpenRouterError("L’appel OpenRouter a échoué.") from error
        if not isinstance(parsed, dict):
            raise OpenRouterError("La réponse OpenRouter est invalide.")
        return parsed


class OpenRouterError(RuntimeError):
    pass
