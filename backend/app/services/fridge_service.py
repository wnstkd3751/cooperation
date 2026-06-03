from bson import ObjectId
from db.mongo import fridge_collection

from datetime import (
    datetime,
    timedelta
)


async def create_item(item, user_id: str):

    data = item.dict()

    print(data)

    data["user_id"] = user_id

    result = await fridge_collection.insert_one(
        data
    )

    return str(result.inserted_id)


async def get_items(user_id: str):

    items = []

    async for item in fridge_collection.find({
        "user_id": user_id
    }):

        item["item_id"] = str(item["_id"])

        del item["_id"]

        items.append(item)

    print(f"get_items: {items}")

    return items


async def delete_item(item_id: str):

    await fridge_collection.delete_one({
        "_id": ObjectId(item_id)
    })


# =========================
# 유통기한 임박 재료
# =========================
async def get_expiring_items(
    user_id: str,
    days: int = 3
):

    today = datetime.now()

    target_date = today + timedelta(
        days=days
    )

    items = []

    print(user_id)

    async for item in fridge_collection.find({
        "user_id": user_id['sub']
    }):
    
        print(item)
        expire_date = item.get(
            "expire_date"
        )

        if not expire_date:
            continue

        try:

            expire_datetime = datetime.strptime(
                expire_date,
                "%Y-%m-%d"
            )

            if (
                today
                <= expire_datetime
                <= target_date
            ):

                remain_days = (
                    expire_datetime - today
                ).days

                item["item_id"] = str(
                    item["_id"]
                )

                del item["_id"]

                item["remain_days"] = (
                    remain_days
                )

                items.append(item)

        except Exception:
            continue

    items.sort(
        key=lambda x: x["remain_days"]
    )

    return items