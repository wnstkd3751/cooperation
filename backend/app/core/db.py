import logging

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings
from app.models import (
    FeedbackLogDocument,
    IngredientDocument,
    ItemDocument,
    RecipeDocument,
    UserDocument,
)

logger = logging.getLogger(__name__)
_client: AsyncIOMotorClient | None = None


async def connect_mongodb() -> None:
    """FastAPI lifespan startup에서 호출"""
    global _client
    try:
        _client = AsyncIOMotorClient(settings.MONGODB_URI)
        await init_beanie(
            database=_client[settings.MONGODB_DB_NAME],
            document_models=[
                UserDocument,
                ItemDocument,
                IngredientDocument,
                RecipeDocument,
                FeedbackLogDocument,
            ],
        )
        logger.info("MongoDB Atlas 연결 성공")
    except Exception as e:
        logger.error(f"MongoDB 연결 실패: {e}")
        raise


async def disconnect_mongodb() -> None:
    """FastAPI lifespan shutdown에서 호출"""
    global _client
    if _client:
        _client.close()
        logger.info("MongoDB 연결 종료")
