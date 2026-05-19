import app.utils.decay as decay

# 카테고리 → 숫자 매핑
CATEGORY_MAP = {
    "단백질": 1.0,
    "채소":   0.8,
    "탄수화물": 0.6,
    "기타":   0.3,
}

def extract_features(ingredient):
    # ingredient = {"name": "계란", "days_left": 1, "category": "단백질"}

    # 1. 유통기한 가중치
    expiry = decay.calculate_expiry_weight_from_date(ingredient["expire_date"])

    # 2. 카테고리 점수 (없는 카테고리면 0.3)
    category = CATEGORY_MAP.get(ingredient["category"], 0.3)

    # 3. 숫자 벡터로 반환
    return [expiry, category]