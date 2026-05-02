"""원본 구조 유지 — Session → Beanie async"""
from httpx import AsyncClient

from app import crud
from app.core.config import settings
from app.models import UserCreate, UserDocument, UserUpdate
from tests.utils.utils import random_email, random_lower_string


async def user_authentication_headers(
    *, client: AsyncClient, email: str, password: str
) -> dict[str, str]:
    data = {"username": email, "password": password}
    r = await client.post(f"{settings.API_V1_STR}/login/access-token", data=data)
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


async def create_random_user() -> UserDocument:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    return await crud.create_user(user_create=user_in)


async def authentication_token_from_email(
    *, client: AsyncClient, email: str
) -> dict[str, str]:
    """
    주어진 이메일로 토큰 발급. 유저가 없으면 생성, 있으면 비밀번호 갱신.
    """
    password = random_lower_string()
    user = await crud.get_user_by_email(email=email)
    if not user:
        user_in = UserCreate(email=email, password=password)
        await crud.create_user(user_create=user_in)
    else:
        user_in_update = UserUpdate(password=password)
        await crud.update_user(db_user=user, user_in=user_in_update)
    return await user_authentication_headers(
        client=client, email=email, password=password
    )
