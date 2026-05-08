from pydantic import BaseModel

class SignupRequest(BaseModel):
    id: str
    password: str
    email: str
    cooking_level: str
    age_group: str
    gender: str


class LoginRequest(BaseModel):
    id: str
    password: str