"""원본 구조 유지 — async 전환"""
import pytest
from httpx import AsyncClient

from app.core.config import settings
from tests.utils.item import create_random_item


@pytest.mark.asyncio
async def test_create_item(
    client: AsyncClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"title": "Foo", "description": "Fighters"}
    response = await client.post(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert "id" in content
    assert "owner_id" in content


@pytest.mark.asyncio
async def test_read_item(
    client: AsyncClient, superuser_token_headers: dict[str, str]
) -> None:
    item = await create_random_item()
    response = await client.get(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == item.title
    assert content["description"] == item.description


@pytest.mark.asyncio
async def test_delete_item(
    client: AsyncClient, superuser_token_headers: dict[str, str]
) -> None:
    item = await create_random_item()
    response = await client.delete(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["message"] == "Item deleted successfully"
