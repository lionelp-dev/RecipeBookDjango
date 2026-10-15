from pydantic import BaseModel, ConfigDict, Field


class GeneratedRecipeStep(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    instruction: str = Field(min_length=1, max_length=2000)
