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
    days: int = 7
):

    # 날짜만 비교 (시:분:초 제거 → 하루 오차 방지)
    today = datetime.now().replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    expiring = []   # 임박 (0 ~ days일 남음)
    expired = []    # 상함 (이미 지남)

    async for item in fridge_collection.find({
        "user_id": user_id
    }):

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
        except Exception:
            continue

        remain_days = (
            expire_datetime - today
        ).days

        item["item_id"] = str(item["_id"])
        del item["_id"]
        item["remain_days"] = remain_days

        if remain_days < 0:
            expired.append(item)
        elif remain_days <= days:
            expiring.append(item)
        # days보다 많이 남은 건 둘 다 아님 → 제외

    # 임박: 적게 남은 순 / 상함: 많이 지난 순
    expiring.sort(key=lambda x: x["remain_days"])
    expired.sort(key=lambda x: x["remain_days"])

    return {
        "expiring": expiring,
        "expired": expired,
    }