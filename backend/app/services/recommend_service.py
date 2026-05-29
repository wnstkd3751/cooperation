from db.mongo import recipe_collection
import app.utils.decay as decay
import app.ML.features as features
# import app.ML.predictor as predictor

def calculate_score(recipe, weight_map):
    score = 0.0
    matched = 0

    for ingredient in recipe["ingredients"]:
        weight = weight_map.get(ingredient["name"], 0)
        score += weight

        if weight != 0:
            matched += 1

    total = len(recipe["ingredients"])
    if total == 0:
        return 0.0

    match_ratio = matched / total

    # pkl 점수 추가 (나중에 pkl 생기면 주석 해제)
    # ml_score = predictor.predict(ingredient)
    # score += ml_score

    return score * match_ratio


async def recommend(ingredients, age_group=None):
    # DB에서 레시피 가져오기
    recipes = await recipe_collection.find({}).to_list(None)

    # 유통기한 가중치 계산
    weighted = decay.get_expiry_weights(ingredients)

    # weight_map 만들기 (연령대 가중치 포함)
    weight_map = {}
    for item in weighted:
        feature_vector = await features.extract_features(item, age_group)
        # feature_vector = [expiry, category, age_weight]
        expiry = feature_vector[0]
        age_weight = feature_vector[2]
        weight_map[item["name"]] = expiry * age_weight

    # 레시피마다 점수 계산
    for recipe in recipes:
        recipe["score"] = calculate_score(recipe, weight_map)

    # 점수 높은 순 정렬
    recipes.sort(key=lambda x: x["score"], reverse=True)

    # _id를 문자열로 변환
    for recipe in recipes:
        recipe["_id"] = str(recipe["_id"])

    return recipes