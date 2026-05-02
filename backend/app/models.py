from datetime import datetime, timezone
from typing import Optional

from beanie import Document, PydanticObjectId
from pydantic import BaseModel, EmailStr, Field


# ────────────────────── User ──────────────────────

class UserDocument(Document):
    email: EmailStr = Field(unique=True)
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    full_name: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"
        indexes = ["email"]


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(default=None, min_length=8, max_length=128)
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None


class UserUpdateMe(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: Optional[str] = None


class UpdatePassword(BaseModel):
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


class UserPublic(BaseModel):
    id: PydanticObjectId
    email: EmailStr
    is_active: bool
    is_superuser: bool
    full_name: Optional[str] = None
    created_at: Optional[datetime] = None


class UsersPublic(BaseModel):
    data: list[UserPublic]
    count: int


# ────────────────────── Item (템플릿 예제 유지) ──────────────────────

class ItemDocument(Document):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)
    owner_id: PydanticObjectId
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "items"
        indexes = ["owner_id"]


class ItemCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)


class ItemUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)


class ItemPublic(BaseModel):
    id: PydanticObjectId
    title: str
    description: Optional[str] = None
    owner_id: PydanticObjectId
    created_at: Optional[datetime] = None


class ItemsPublic(BaseModel):
    data: list[ItemPublic]
    count: int


# ────────────────────── Ingredient (프로젝트 추가) ──────────────────────

class IngredientDocument(Document):
    user_id: PydanticObjectId
    name: str
    quantity: float
    unit: str                            # g, ml, 개 등
    expiry_date: Optional[datetime] = None
    category: Optional[str] = None       # 육류, 채소, 유제품 등
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "ingredients"
        indexes = ["user_id", "expiry_date"]


# ────────────────────── Recipe (프로젝트 추가) ──────────────────────

class RecipeIngredient(BaseModel):
    name: str
    quantity: float
    unit: str
    is_main: bool = False   # 주재료 여부 → 스코어링 가중치에 활용


class RecipeDocument(Document):
    title: str
    description: Optional[str] = None
    ingredients: list[RecipeIngredient] = []
    steps: list[str] = []
    cook_time_minutes: Optional[int] = None
    meal_type: Optional[str] = None      # 아침 / 점심 / 저녁
    tags: list[str] = []
    average_rating: float = 0.0
    rating_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "recipes"
        indexes = ["title", "tags", "meal_type"]


# ────────────────────── FeedbackLog (프로젝트 추가) ──────────────────────

class FeedbackLogDocument(Document):
    user_id: PydanticObjectId
    recipe_id: PydanticObjectId
    rating: int                          # 1~5점
    cooked: bool = False                 # 실제 조리 여부
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "feedback_logs"
        indexes = ["user_id", "recipe_id"]


# ────────────────────── 공통 응답 모델 ──────────────────────

class Message(BaseModel):
    message: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str | None = None
