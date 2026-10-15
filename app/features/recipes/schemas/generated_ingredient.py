from pydantic import BaseModel, ConfigDict, Field


class GeneratedIngredient(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=100)
    quantity: float = Field(gt=0)
    unit: str | None = Field(default=None, max_length=50)
