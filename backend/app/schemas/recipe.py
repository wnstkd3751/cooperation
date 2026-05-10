from pydantic import BaseModel
from typing import List, Optional


class Nutrition(BaseModel):
    calories: Optional[float]
    carbohydrate: Optional[float]
    protein: Optional[float]
    fat: Optional[float]
    sodium: Optional[float]


class Images(BaseModel):
    main: Optional[str]
    detail: Optional[str]


class Ingredient(BaseModel):
    name: str
    amount: str


class RecipeStep(BaseModel):
    stepNumber: int
    description: str
    imageUrl: Optional[str]


class Recipe(BaseModel):

    rcpSeq: str

    recipeName: str

    cookingMethod: Optional[str]

    recipeCategory: Optional[str]

    servingSize: Optional[str]

    nutrition: Nutrition

    hashtags: List[str]

    images: Images

    ingredientsRaw: Optional[str]

    ingredients: List[Ingredient]

    steps: List[RecipeStep]

    sodiumTip: Optional[str]