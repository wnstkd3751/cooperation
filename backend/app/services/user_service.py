from db.mongo import db
from app.utils.security import hash_password, verify_password
from datetime import datetime

user_collection = db["user"]
fridge_collection = db["fridge_items"]
favorite_collection = db["favorites"]
feedback_collection = db["feedback_log"]


def calc_age_group(age: int) -> str:
    if age < 20:
        return "10대"
    elif age < 30:
        return "20대"
    elif age < 40:
        return "30대"
    elif age < 50:
        return "40대"
    else:
        return "50대 이상"


async def create_user(user):
    user_dict = user.dict()

    # 비밀번호 암호화
    user_dict["password"] = hash_password(user.password)

    # age에서 age_group 자동 계산
    user_dict["age_group"] = calc_age_group(user.age)

    # 생성 시간 추가
    user_dict["created_at"] = datetime.utcnow().isoformat()

    result = await user_collection.insert_one(user_dict)
    return str(result.inserted_id)


async def delete_user(user_id: str):

    # 연결된 데이터 cascade 삭제
    await fridge_collection.delete_many({"user_id": user_id})
    await favorite_collection.delete_many({"user_id": user_id})
    await feedback_collection.delete_many({"user_id": user_id})

    result = await user_collection.delete_one({"id": user_id})

    return result.deleted_count > 0


async def authenticate_user(user_id, password):
    user = await user_collection.find_one({"id": user_id})

    if not user:
        return None

    if not verify_password(password, user["password"]):
        return None

    return user

async def get_user(user_id: str):
    user = await user_collection.find_one(
        {"id": user_id},
        {"_id": 0, "password": 0}
    )

    return user


async def update_user(user_id: str, data):
    result = await user_collection.update_one(
        {"id": user_id},
        {
            "$set": {
                "email": data.email,
                "cooking_level": data.cooking_level,
                "age_group": data.age_group,
                "gender": data.gender
            }
        }
    )

    return result.modified_count