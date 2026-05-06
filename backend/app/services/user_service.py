from db.mongo import db
from app.utils.security import hash_password, verify_password
from datetime import datetime

user_collection = db["user"]


def create_user(user):
    user_dict = user.dict()

    # 비밀번호 암호화
    user_dict["password"] = hash_password(user.password)

    # 생성 시간 추가
    user_dict["created_at"] = datetime.utcnow().isoformat()

    result = user_collection.insert_one(user_dict)
    return str(result.inserted_id)


def authenticate_user(user_id, password):
    user = user_collection.find_one({"id": user_id})

    if not user:
        return None

    if not verify_password(password, user["password"]):
        return None

    return user