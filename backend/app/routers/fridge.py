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
    result = await fridge_service.get_expiring_items(
        user_id=user["sub"],
        days=7
    )

    expiring = result["expiring"]   # 임박 (0~7일)
    expired = result["expired"]     # 상함 (지남)

    # 상단 요약 문구
    if len(expiring) == 0:
        summary = "임박한 재료가 없습니다"
        message = ""
    else:
        first = expiring[0]["name"]
        summary = first
        if len(expiring) > 1:
            summary += f" 외 {len(expiring)-1}개"
        message = "유통기한 7일 이내!"

    return {
        "summary": summary,
        "message": message,
        "items": expiring,    # 기존 키 유지 (임박)
        "expired": expired,   # 신규 (상한)
    }