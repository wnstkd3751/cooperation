# backend/app/services/fridge_service.py
from datetime import datetime
from bson import ObjectId
from db.mongo import fridge_collection


def create_item(item):
    data = item.dict()

    # item_id 생성
    data["item_id"] = str(datetime.utcnow().timestamp())

    fridge_collection.insert_one(data)

    return data["item_id"]


def get_items(user_id: str):
    items = []
    for item in fridge_collection.find({"user_id": user_id}):
        item["item_id"] = str(item["_id"])
        del item["_id"]
        items.append(item)
    return items


def delete_item(item_id: str):
    fridge_collection.delete_one({"_id": ObjectId(item_id)})