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

class SendCodeRequest(BaseModel):
    email: str


class VerifyCodeRequest(BaseModel):
    email: str
    code: str


class ChangePasswordRequest(BaseModel):
    email: str
    password: str