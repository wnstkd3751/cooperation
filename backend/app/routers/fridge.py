# backend/app/routers/fridge.py
from fastapi import APIRouter
from fastapi import Depends
from app.utils.deps import get_current_user
from app.schemas.fridge import FridgeItemCreate
from app.services import fridge_service

router = APIRouter(prefix="/fridge", tags=["fridge"])


@router.post("/")
def add_item(
    item: FridgeItemCreate,
    user=Depends(get_current_user)
):

    item_id = fridge_service.create_item(item)

    return {
        "message": "추가 완료",
        "item_id": item_id
    }



@router.get("/")
def get_items(
    user_id: str,
    user=Depends(get_current_user)
):    
    return fridge_service.get_items(user_id)
    


@router.delete("/{item_id}")
def remove_item(item_id: str):
    fridge_service.delete_item(item_id)
    return {"message": "삭제 완료"}