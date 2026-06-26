from pydantic import BaseModel, Field

class ConsentInfo(BaseModel):
    privacy_policy: bool
    ai_transfer: bool


class UserCreate(BaseModel):
    id: str
    password: str
    email: str
    age: int = Field(..., ge=14)
    cooking_level: str
    age_group: str
    gender: str
    consents: ConsentInfo


class UserLogin(BaseModel):
    id: str
    password: str

class UserUpdateRequest(BaseModel):
    email: str
    cooking_level: str
    age_group: str
    gender: str