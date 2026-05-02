"""원본 구조 유지 — 비밀번호 재설정 테스트 제거, async 전환"""
import pytest
from httpx import AsyncClient

from app.core.config import settings


@pytest.mark.asyncio
async def test_get_access_token(client: AsyncClient) -> None:
    login_data = {
        "username": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    r = await client.post(
        f"{settings.API_V1_STR}/login/access-token", data=login_data
    )
    tokens = r.json()
    assert r.status_code == 200
    assert "access_token" in tokens


@pytest.mark.asyncio
async def test_get_access_token_incorrect_password(client: AsyncClient) -> None:
    login_data = {
        "username": settings.FIRST_SUPERUSER,
        "password": "incorrect",
    }
    r = await client.post(
        f"{settings.API_V1_STR}/login/access-token", data=login_data
    )
    assert r.status_code == 400


@pytest.mark.asyncio
async def test_use_access_token(
    client: AsyncClient, superuser_token_headers: dict[str, str]
) -> None:
    r = await client.post(
        f"{settings.API_V1_STR}/login/test-token", headers=superuser_token_headers
    )
    result = r.json()
    assert r.status_code == 200
    assert "email" in result
