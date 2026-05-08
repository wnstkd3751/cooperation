def calculate_expiry_weight(days_left):

    # days_left가 0 이하면 → 1.0 반환
    if days_left <= 0:
        return 1.0

    # days_left가 30 이상이면 → 0.0 반환
    elif days_left >= 30:
        return 0.0

    # 그 사이면 → 수식으로 계산해서 반환
    else:
        result = (30 - days_left) / 30
        return round(result,2)

def get_expiry_weights(ingredients):

    # 결과를 담을 빈 리스트 만들기
    result = []

    # ingredients를 하나씩 꺼내서
    for item in ingredients:

        # 방금 만든 함수로 가중치 계산
        weight = calculate_expiry_weight(item["days_left"])

        # item에 weight 추가
        item["weight"] = weight

        # result에 item 추가
        result.append(item)

    # weight값 정렬
    result.sort(key=lambda x: x["weight"], reverse=True)
    
    return result