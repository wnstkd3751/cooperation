import app.utils.decay as decay
from db.mongo import db

# 카테고리 → 숫자 매핑
CATEGORY_MAP = {
    "단백질": 1.0,
    "채소":   0.8,
    "탄수화물": 0.6,
    "기타":   0.3,
}

async def get_age_weight(age_group: str, category: str) -> float:
    if not age_group:
        return 1.0

    collection = db["age_group_preference"]
    doc = await collection.find_one({
        "age_group": age_group,
        "food_category": category
    })

    if doc:
        return doc["weight"]
    return 1.0


async def extract_features(ingredient, age_group=None):
    # 유통기한 가중치
    expiry = decay.calculate_expiry_weight_from_date(ingredient["expire_date"])

    # 카테고리 점수
    category = CATEGORY_MAP.get(ingredient["category"], 0.3)

    # 연령대 가중치 (DB 조회)
    age_weight = await get_age_weight(age_group, ingredient.get("category", "기타"))

    # 숫자 벡터로 반환
    return [expiry, category, age_weight]