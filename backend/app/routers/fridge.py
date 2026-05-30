# backend/app/routers/fridge.py
from fastapi import APIRouter, Depends
from app.utils.deps import get_current_user
from app.schemas.fridge import FridgeItemCreate
from app.services import fridge_service

router = APIRouter(prefix="/fridge", tags=["fridge"])


@router.post("/")
async def add_item(
    item: FridgeItemCreate,
    user=Depends(get_current_user)
):

    item_id = await fridge_service.create_item(item, user["sub"])

    return {
        "message": "추가 완료",
        "item_id": item_id
    }



@router.get("/")
async def get_items(
    user=Depends(get_current_user)
):
    return await fridge_service.get_items(user["sub"])



@router.delete("/{item_id}")
async def remove_item(item_id: str):
    await fridge_service.delete_item(item_id)
    return {"message": "삭제 완료"}

@router.get("/expiring")
async def expiring_foods(
    user=Depends(get_current_user)
):
    print(user)
    items = await fridge_service.get_expiring_items(
        user_id=user,
        days=3
    )

    if len(items) == 0:

        return {
            "summary":
                "임박한 재료가 없습니다",

            "items": []
        }

    first = items[0]["name"]

    summary = first

    if len(items) > 1:

        summary += (
            f" 외 {len(items)-1}개"
        )

    return {
        "summary":
            summary,

        "message":
            "유통기한 3일 이내!",

        "items":
            items
    }