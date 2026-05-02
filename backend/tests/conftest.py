"""
원본 대비 변경:
- PostgreSQL Session → mongomock-motor 인메모리 MongoDB
- 동기 TestClient → AsyncClient
"""
from collections.abc import AsyncGenerator

import pytest
from beanie import init_beanie
from httpx import ASGITransport, AsyncClient
from mongomock_motor import AsyncMongoMockClient

from app.core.config import settings
from app.main import app
from app.models import (
    FeedbackLogDocument,
    IngredientDocument,
    ItemDocument,
    RecipeDocument,
    UserDocument,
)
from tests.utils.user import authentication_token_from_email
from tests.utils.utils import get_superuser_token_headers


@pytest.fixture(autouse=True)
async def init_test_db():
    """각 테스트마다 인메모리 MongoDB 초기화"""
    client = AsyncMongoMockClient()
    await init_beanie(
        database=client["test_db"],
        document_models=[
            UserDocument,
            ItemDocument,
            IngredientDocument,
            RecipeDocument,
            FeedbackLogDocument,
        ],
    )
    yield


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as c:
        yield c


@pytest.fixture
async def superuser_token_headers(client: AsyncClient) -> dict[str, str]:
    return await get_superuser_token_headers(client)


@pytest.fixture
async def normal_user_token_headers(client: AsyncClient) -> dict[str, str]:
    return await authentication_token_from_email(
        client=client, email=settings.EMAIL_TEST_USER
    )
