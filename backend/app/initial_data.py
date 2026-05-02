import asyncio
import logging

from app.core.config import settings
from app.core.db import connect_mongodb, disconnect_mongodb
from app.crud import create_user, get_user_by_email
from app.models import UserCreate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def init() -> None:
    await connect_mongodb()
    user = await get_user_by_email(email=settings.FIRST_SUPERUSER)
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        await create_user(user_create=user_in)
        logger.info("최초 슈퍼유저 생성 완료")
    else:
        logger.info("슈퍼유저 이미 존재")
    await disconnect_mongodb()


def main() -> None:
    logger.info("Creating initial data")
    asyncio.run(init())
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
