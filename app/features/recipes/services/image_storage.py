"""Filesystem storage helpers for recipe images."""

from __future__ import annotations

import base64
import binascii
import re
import uuid
from pathlib import Path

from django.conf import settings
from django.core.files.uploadedfile import UploadedFile

MAX_IMAGE_SIZE = 5 * 1024 * 1024
DATA_URL_RE = re.compile(r"^data:image/(jpeg|jpg|png|webp);base64,([A-Za-z0-9+/=]+)$", re.I)


class ImageValidationError(ValueError):
    pass


def image_extension(content: bytes) -> str:
    if content.startswith(b"\xff\xd8\xff"):
        return "jpeg"
    if content.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if len(content) >= 12 and content[:4] == b"RIFF" and content[8:12] == b"WEBP":
        return "webp"
    raise ImageValidationError("L’image doit être au format JPEG, PNG ou WebP.")


def _recipe_directory() -> Path:
    directory = Path(settings.MEDIA_ROOT) / "recipes"
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def _save_bytes(content: bytes) -> str:
    if not content:
        raise ImageValidationError("Le fichier image est vide.")
    if len(content) > MAX_IMAGE_SIZE:
        raise ImageValidationError("L’image ne doit pas dépasser 5 Mo.")
    extension = image_extension(content)
    key = f"recipes/{uuid.uuid4()}.{extension}"
    (_recipe_directory() / key.removeprefix("recipes/")).write_bytes(content)
    return key


def store_uploaded_image(upload: UploadedFile) -> str:
    if upload.size is not None and upload.size > MAX_IMAGE_SIZE:
        raise ImageValidationError("L’image ne doit pas dépasser 5 Mo.")
    return _save_bytes(upload.read())


def store_data_url(data_url: str) -> str:
    match = DATA_URL_RE.fullmatch(data_url)
    if not match:
        raise ImageValidationError("Le format de l’image générée est invalide.")
    try:
        content = base64.b64decode(match.group(2), validate=True)
    except (binascii.Error, ValueError) as error:
        raise ImageValidationError("Le contenu de l’image générée est invalide.") from error
    return _save_bytes(content)


def image_url(key: str | None) -> str | None:
    return f"{settings.MEDIA_URL}{key}" if key else None


def delete_recipe_image(key: str | None) -> None:
    if not key or not key.startswith("recipes/"):
        return
    path = Path(settings.MEDIA_ROOT) / key
    try:
        path.unlink(missing_ok=True)
    except OSError:
        # Deleting an image should not prevent a successful database deletion.
        pass
