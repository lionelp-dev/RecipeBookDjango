from __future__ import annotations

from typing import Protocol, TypeVar

from django.db import models
from django.db.models.query import QuerySet

ModelT = TypeVar("ModelT", bound=models.Model, covariant=True)


class RelatedCollection(Protocol[ModelT]):
    def all(self) -> QuerySet[ModelT]: ...
