from datetime import datetime
import re

# =========================
# 재료 파싱
# =========================
import re


def parse_ingredients(raw_text: str):

    ingredients = []

    if not raw_text:
        return ingredients

    # 줄바꿈 제거
    raw_text = raw_text.replace("\n", " ")

    # [1인분] 제거
    raw_text = re.sub(r"\[[^\]]+\]", "", raw_text)

    # 괄호 제거
    raw_text = re.sub(r"\([^)]*\)", "", raw_text)

    # 쉼표 기준 1차 분리
    parts = raw_text.split(",")

    ingredient_pattern = re.compile(
        r"([가-힣A-Za-z\s]+?)\s+([\d\.]+\s?(?:g|kg|ml|L|개|큰술|작은술|컵|장|줌|약간))"
    )

    for part in parts:

        part = part.strip()

        if not part:
            continue

        matches = ingredient_pattern.findall(part)

        if matches:

            for match in matches:

                name = match[0].strip()

                amount = match[1].strip()

                ingredients.append({
                    "name": name,
                    "amount": amount
                })

        else:

            ingredients.append({
                "name": part,
                "amount": ""
            })

    return ingredients

# =========================
# 조리 순서 파싱
# =========================
def parse_steps(recipe_data):

    steps = []

    for i in range(1, 21):

        step_key = f"MANUAL{i:02d}"

        image_key = f"MANUAL_IMG{i:02d}"

        description = recipe_data.get(step_key, "").strip()

        image_url = recipe_data.get(image_key, "").strip()

        if description:

            steps.append({
                "stepNumber": i,
                "description": description,
                "imageUrl": image_url
            })

    return steps

# =========================
# 해시태그 파싱
# =========================
def parse_hashtags(raw_hashtag):

    if not raw_hashtag:
        return []

    return [
        tag.strip("# ").strip()
        for tag in raw_hashtag.split()
        if tag.strip()
    ]


# =========================
# MongoDB 문서 변환
# =========================
def transform_recipe(recipe):

    document = {

        "rcpSeq": recipe.get("RCP_SEQ"),

        "recipeName": recipe.get("RCP_NM"),

        "cookingMethod": recipe.get("RCP_WAY2"),

        "recipeCategory": recipe.get("RCP_PAT2"),

        "servingSize": recipe.get("INFO_WGT"),

        "nutrition": {
            "calories": recipe.get("INFO_ENG"),
            "carbohydrate": recipe.get("INFO_CAR"),
            "protein": recipe.get("INFO_PRO"),
            "fat": recipe.get("INFO_FAT"),
            "sodium": recipe.get("INFO_NA")
        },

        "hashtags": parse_hashtags(
            recipe.get("HASH_TAG", "")
        ),

        "images": {
            "main": recipe.get("ATT_FILE_NO_MAIN"),
            "detail": recipe.get("ATT_FILE_NO_MK")
        },

        "ingredientsRaw": recipe.get("RCP_PARTS_DTLS"),

        "ingredients": parse_ingredients(
            recipe.get("RCP_PARTS_DTLS", "")
        ),

        "steps": parse_steps(recipe),

        "sodiumTip": recipe.get("RCP_NA_TIP"),

        "createdAt": datetime.utcnow()
    }

    return document