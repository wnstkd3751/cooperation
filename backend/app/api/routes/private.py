from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from app.core.security import get_password_hash
from app.models import UserDocument, UserPublic

router = APIRouter(tags=["private"], prefix="/private")


class PrivateUserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    is_verified: bool = False


@router.post("/users/", response_model=UserPublic)
async def create_user(user_in: PrivateUserCreate) -> Any:
    """
    로컬 환경 전용 - 인증 없이 유저 생성.
    main.py에서 ENVIRONMENT == "local"일 때만 라우터 등록됨.
    """
    user = UserDocument(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
    )
    await user.insert()
    return user
