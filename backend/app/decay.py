import math
from datetime import datetime, timezone

DECAY_LAMBDA = 0.3      # 감쇠 계수 (클수록 D-day에 민감)
EXPIRED_WEIGHT = 2.0    # 이미 만료된 재료 → 최고 가중치
NO_EXPIRY_WEIGHT = 0.1  # 유통기한 없음 (소금, 설탕 등)


def calculate_expiry_weight(expiry_date: datetime | None) -> float:
    """유통기한 → 0.0~2.0 가중치 변환"""
    if expiry_date is None:
        return NO_EXPIRY_WEIGHT

    now = datetime.now(timezone.utc)
    if expiry_date.tzinfo is None:
        expiry_date = expiry_date.replace(tzinfo=timezone.utc)

    days_left = (expiry_date - now).days
    if days_left < 0:
        return EXPIRED_WEIGHT
    return round(math.exp(-DECAY_LAMBDA * days_left), 4)


def get_urgent_ingredients(
    ingredients: list[dict], threshold_days: int = 3
) -> list[dict]:
    """D-3 이하 임박 재료 필터링 — LLM 프롬프트 우선순위 반영용"""
    now = datetime.now(timezone.utc)
    urgent = []

    for ing in ingredients:
        expiry = ing.get("expiry_date")
        if expiry is None:
            continue
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

        days_left = (expiry - now).days
        if days_left <= threshold_days:
            urgent.append({
                **ing,
                "days_left": days_left,
                "weight": calculate_expiry_weight(expiry),
            })

    return sorted(urgent, key=lambda x: x["weight"], reverse=True)
