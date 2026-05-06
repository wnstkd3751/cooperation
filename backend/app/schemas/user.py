from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    id: str
    password: str
    email: str
    cooking_level: str
    age_group: str
    gender: str


class UserLogin(BaseModel):
    id: str
    password: str