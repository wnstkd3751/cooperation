# backend/app/services/fridge_service.py
from datetime import datetime
from bson import ObjectId
from db.mongo import fridge_collection


async def create_item(item, user_id: str):
    data = item.dict()

    # item_id 생성
    data["item_id"] = str(datetime.utcnow().timestamp())
    data["user_id"] = user_id

    await fridge_collection.insert_one(data)

    return data["item_id"]


async def get_items(user_id: str):
    items = []
    async for item in fridge_collection.find({"user_id": user_id}):
        item["item_id"] = str(item["_id"])
        del item["_id"]
        items.append(item)

    print(f"get_items: {items}")
    return items


async def delete_item(item_id: str):
    await fridge_collection.delete_one({"_id": ObjectId(item_id)})