"""원본 구조 유지 — Session → Beanie async"""
import pytest

from app import crud
from app.core.security import verify_password
from app.models import UserCreate, UserUpdate
from tests.utils.utils import random_email, random_lower_string


@pytest.mark.asyncio
async def test_create_user() -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = await crud.create_user(user_create=user_in)
    assert user.email == email
    assert hasattr(user, "hashed_password")


@pytest.mark.asyncio
async def test_authenticate_user() -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = await crud.create_user(user_create=user_in)
    authenticated_user = await crud.authenticate(email=email, password=password)
    assert authenticated_user
    assert user.email == authenticated_user.email


@pytest.mark.asyncio
async def test_not_authenticate_user() -> None:
    email = random_email()
    password = random_lower_string()
    user = await crud.authenticate(email=email, password=password)
    assert user is None


@pytest.mark.asyncio
async def test_check_if_user_is_active() -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = await crud.create_user(user_create=user_in)
    assert user.is_active is True


@pytest.mark.asyncio
async def test_check_if_user_is_superuser() -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password, is_superuser=True)
    user = await crud.create_user(user_create=user_in)
    assert user.is_superuser is True


@pytest.mark.asyncio
async def test_update_user() -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password, is_superuser=True)
    user = await crud.create_user(user_create=user_in)
    new_password = random_lower_string()
    user_in_update = UserUpdate(password=new_password, is_superuser=True)
    await crud.update_user(db_user=user, user_in=user_in_update)
    verified, _ = verify_password(new_password, user.hashed_password)
    assert verified
