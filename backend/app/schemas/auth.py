from pydantic import BaseModel, Field

class ConsentInfo(BaseModel):
    privacy_policy: bool
    ai_transfer: bool

class CheckIdRequest(BaseModel):
    id: str

class SignupRequest(BaseModel):
    id: str
    password: str
    email: str
    age: int = Field(..., ge=14, description="만 14세 이상만 가입 가능")
    cooking_level: str
    gender: str
    consents: ConsentInfo

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