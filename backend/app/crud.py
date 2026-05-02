from beanie import PydanticObjectId

from app.core.security import get_password_hash, verify_password
from app.models import (
    ItemCreate,
    ItemDocument,
    UserCreate,
    UserDocument,
    UserUpdate,
)


# ────────── User ──────────

async def create_user(*, user_create: UserCreate) -> UserDocument:
    db_obj = UserDocument(
        email=user_create.email,
        hashed_password=get_password_hash(user_create.password),
        full_name=user_create.full_name,
        is_active=user_create.is_active,
        is_superuser=user_create.is_superuser,
    )
    await db_obj.insert()
    return db_obj


async def update_user(*, db_user: UserDocument, user_in: UserUpdate) -> UserDocument:
    user_data = user_in.model_dump(exclude_unset=True)
    if "password" in user_data:
        user_data["hashed_password"] = get_password_hash(user_data.pop("password"))
    for field, value in user_data.items():
        setattr(db_user, field, value)
    await db_user.save()
    return db_user


async def get_user_by_email(*, email: str) -> UserDocument | None:
    return await UserDocument.find_one(UserDocument.email == email)


# Timing attack 방지용 더미 해시 (원본에서 가져옴)
DUMMY_HASH = "$argon2id$v=19$m=65536,t=3,p=4$MjQyZWE1MzBjYjJlZTI0Yw$YTU4NGM5ZTZmYjE2NzZlZjY0ZWY3ZGRkY2U2OWFjNjk"


async def authenticate(*, email: str, password: str) -> UserDocument | None:
    db_user = await get_user_by_email(email=email)
    if not db_user:
        # 유저가 없을 때도 verify를 호출해 응답 시간을 일정하게 유지
        verify_password(password, DUMMY_HASH)
        return None
    verified, updated_hash = verify_password(password, db_user.hashed_password)
    if not verified:
        return None
    if updated_hash:
        db_user.hashed_password = updated_hash
        await db_user.save()
    return db_user


# ────────── Item ──────────

async def create_item(
    *, item_in: ItemCreate, owner_id: PydanticObjectId
) -> ItemDocument:
    db_item = ItemDocument(**item_in.model_dump(), owner_id=owner_id)
    await db_item.insert()
    return db_item
