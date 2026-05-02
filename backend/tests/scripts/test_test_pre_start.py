"""원본 구조 유지 — MongoDB ping 모킹"""
from unittest.mock import AsyncMock, patch

import pytest

from app.tests_pre_start import init, logger


@pytest.mark.asyncio
async def test_init_successful_connection() -> None:
    with (
        patch("app.tests_pre_start.AsyncIOMotorClient") as mock_client_cls,
        patch.object(logger, "info"),
        patch.object(logger, "error"),
    ):
        mock_client = AsyncMock()
        mock_client.admin.command = AsyncMock(return_value={"ok": 1})
        mock_client_cls.return_value = mock_client

        try:
            await init()
            connection_successful = True
        except Exception:
            connection_successful = False

        assert connection_successful
