# backend/app/schemas/fridge.py
from pydantic import BaseModel

class FridgeItemCreate(BaseModel):
    user_id: str
    food_id: str
    name: str
    quantity: int
    category: str
    image: str | None = None
    purchase_date: str
    expire_date: str
    created_at: str