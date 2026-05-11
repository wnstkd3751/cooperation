import app.utils.decay as decay
    
async def calculate_score(recipe, weight_map):
    score = 0.0
    for ingredient in recipe["ingredients"]:
        # 유저가 가진 재료면 weight 더하기
        # 없는 재료면 0 더하기
        score += weight_map.get(ingredient, 0)
        
    return score

async def recommend(ingredients, recipes):
    # 가중치 계산
    weighted = decay.get_expiry_weights(ingredients)

    # weight_map 만들기
    weight_map = {}
    for item in weighted:
        weight_map[item["name"]] = item["weight"]

    # 레시피마다 점수 계산
    for recipe in recipes:
        recipe["score"] = calculate_score(recipe, weight_map)

    # 점수 높은 순 정렬
    recipes.sort(key=lambda x: x["score"], reverse=True)

    return recipes