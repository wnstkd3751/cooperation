"""원본 구조 유지 — async 전환"""
import pytest
from httpx import AsyncClient

from app import crud
from app.core.config import settings


@pytest.mark.asyncio
async def test_create_user(client: AsyncClient) -> None:
    r = await client.post(
        f"{settings.API_V1_STR}/private/users/",
        json={
            "email": "pollo@listo.com",
            "password": "password123",
            "full_name": "Pollo Listo",
        },
    )
    assert r.status_code == 200
    user = await crud.get_user_by_email(email="pollo@listo.com")
    assert user
    assert user.email == "pollo@listo.com"
    assert user.full_name == "Pollo Listo"
