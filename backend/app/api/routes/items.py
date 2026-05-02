from typing import Any

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException

from app import crud
from app.api.deps import CurrentUser
from app.models import (
    ItemCreate,
    ItemDocument,
    ItemPublic,
    ItemsPublic,
    ItemUpdate,
    Message,
)

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/", response_model=ItemsPublic)
async def read_items(
    current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    if current_user.is_superuser:
        items = await ItemDocument.find_all().skip(skip).limit(limit).to_list()
        count = await ItemDocument.count()
    else:
        items = (
            await ItemDocument.find(ItemDocument.owner_id == current_user.id)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        count = await ItemDocument.find(
            ItemDocument.owner_id == current_user.id
        ).count()
    return ItemsPublic(
        data=[ItemPublic.model_validate(i.model_dump()) for i in items], count=count
    )


@router.get("/{id}", response_model=ItemPublic)
async def read_item(current_user: CurrentUser, id: PydanticObjectId) -> Any:
    item = await ItemDocument.get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and str(item.owner_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return item


@router.post("/", response_model=ItemPublic)
async def create_item(
    *, current_user: CurrentUser, item_in: ItemCreate
) -> Any:
    return await crud.create_item(item_in=item_in, owner_id=current_user.id)


@router.put("/{id}", response_model=ItemPublic)
async def update_item(
    *, current_user: CurrentUser, id: PydanticObjectId, item_in: ItemUpdate
) -> Any:
    item = await ItemDocument.get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and str(item.owner_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    for field, value in item_in.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    await item.save()
    return item


@router.delete("/{id}")
async def delete_item(current_user: CurrentUser, id: PydanticObjectId) -> Message:
    item = await ItemDocument.get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and str(item.owner_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    await item.delete()
    return Message(message="Item deleted successfully")
