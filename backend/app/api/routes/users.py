from typing import Any

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException

from app import crud
from app.api.deps import CurrentUser, get_current_active_superuser
from app.core.security import get_password_hash, verify_password
from app.models import (
    Message,
    UpdatePassword,
    UserCreate,
    UserDocument,
    UserPublic,
    UserRegister,
    UsersPublic,
    UserUpdate,
    UserUpdateMe,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UsersPublic,
)
async def read_users(skip: int = 0, limit: int = 100) -> Any:
    """유저 목록 조회 (슈퍼유저 전용)"""
    users = await UserDocument.find_all().skip(skip).limit(limit).to_list()
    count = await UserDocument.count()
    return UsersPublic(
        data=[UserPublic.model_validate(u.model_dump()) for u in users], count=count
    )


@router.post(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UserPublic,
)
async def create_user(*, user_in: UserCreate) -> Any:
    """신규 유저 생성 (슈퍼유저 전용)"""
    user = await crud.get_user_by_email(email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = await crud.create_user(user_create=user_in)
    return user


@router.patch("/me", response_model=UserPublic)
async def update_user_me(*, user_in: UserUpdateMe, current_user: CurrentUser) -> Any:
    """본인 정보 수정"""
    if user_in.email:
        existing_user = await crud.get_user_by_email(email=user_in.email)
        if existing_user and str(existing_user.id) != str(current_user.id):
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )
    for field, value in user_in.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    await current_user.save()
    return current_user


@router.patch("/me/password", response_model=Message)
async def update_password_me(
    *, body: UpdatePassword, current_user: CurrentUser
) -> Any:
    """본인 비밀번호 변경"""
    verified, _ = verify_password(body.current_password, current_user.hashed_password)
    if not verified:
        raise HTTPException(status_code=400, detail="Incorrect password")
    if body.current_password == body.new_password:
        raise HTTPException(
            status_code=400,
            detail="New password cannot be the same as the current one",
        )
    current_user.hashed_password = get_password_hash(body.new_password)
    await current_user.save()
    return Message(message="Password updated successfully")


@router.get("/me", response_model=UserPublic)
async def read_user_me(current_user: CurrentUser) -> Any:
    return current_user


@router.delete("/me", response_model=Message)
async def delete_user_me(current_user: CurrentUser) -> Any:
    if current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="Super users are not allowed to delete themselves"
        )
    await current_user.delete()
    return Message(message="User deleted successfully")


@router.post("/signup", response_model=UserPublic)
async def register_user(user_in: UserRegister) -> Any:
    """유저 회원가입 (로그인 불필요)"""
    user = await crud.get_user_by_email(email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    user_create = UserCreate.model_validate(user_in.model_dump())
    return await crud.create_user(user_create=user_create)


@router.get("/{user_id}", response_model=UserPublic)
async def read_user_by_id(
    user_id: PydanticObjectId, current_user: CurrentUser
) -> Any:
    user = await UserDocument.get(user_id)
    if user == current_user:
        return user
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch(
    "/{user_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UserPublic,
)
async def update_user(*, user_id: PydanticObjectId, user_in: UserUpdate) -> Any:
    db_user = await UserDocument.get(user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    if user_in.email:
        existing_user = await crud.get_user_by_email(email=user_in.email)
        if existing_user and str(existing_user.id) != str(user_id):
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )
    return await crud.update_user(db_user=db_user, user_in=user_in)


@router.delete("/{user_id}", dependencies=[Depends(get_current_active_superuser)])
async def delete_user(
    current_user: CurrentUser, user_id: PydanticObjectId
) -> Message:
    user = await UserDocument.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if str(user.id) == str(current_user.id):
        raise HTTPException(
            status_code=403, detail="Super users are not allowed to delete themselves"
        )
    await user.delete()
    return Message(message="User deleted successfully")
