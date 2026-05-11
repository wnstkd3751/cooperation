import requests

from db.mongo import recipe_collection

from app.utils.recipe_parser import transform_recipe

import os

from dotenv import load_dotenv

load_dotenv()


API_KEY = os.getenv("API_KEY")

SERVICE_ID = "COOKRCP01"

BASE_URL = "http://openapi.foodsafetykorea.go.kr/api"


# =========================
# API 호출
# =========================
def fetch_recipe_data(start_idx=1, end_idx=1000):

    url = (
        f"{BASE_URL}/"
        f"{API_KEY}/"
        f"{SERVICE_ID}/json/"
        f"{start_idx}/"
        f"{end_idx}"
    )

    response = requests.get(url)

    response.raise_for_status()

    data = response.json()

    print(data)

    if "COOKRCP01" not in data:
        raise Exception(f"API 응답 오류: {data}")

    return data["COOKRCP01"]["row"]


# =========================
# 레시피 저장
# =========================
def import_recipes():

    inserted_count = 0

    recipes = fetch_recipe_data(1001, 2000)

    for recipe in recipes:

        rcp_seq = recipe.get("RCP_SEQ")

        exists = recipe_collection.find_one({
            "rcpSeq": rcp_seq
        })

        if exists:
            continue

        document = transform_recipe(recipe)

        recipe_collection.insert_one(document)

        inserted_count += 1

    return inserted_count


# =========================
# 전체 조회 + 검색 + 카테고리
# =========================
def get_recipes(
    page: int = 1,
    size: int = 10,

    category: str = None,
    keyword: str = None,
    searchType: str = None
):

    skip = (page - 1) * size

    # =========================
    # 동적 query 생성
    # =========================
    query = {}

    # 카테고리
    if category:

        query["recipeCategory"] = category

    # =========================
    # 검색
    # =========================

    if keyword:

        # 레시피명 검색
        if searchType == "recipe":

            query["recipeName"] = {
                "$regex": f".*{keyword}.*",
                "$options": "i"
            }

        # 재료 검색
        elif searchType == "ingredient":

            query["ingredients.name"] = {
                "$regex": f".*{keyword}.*",
                "$options": "i"
            }

    # =========================
    # total count
    # =========================
    total = recipe_collection.count_documents(
        query
    )

    # =========================
    # projection
    # =========================
    projection = {
        "_id": 0,
        "rcpSeq": 1,
        "recipeName": 1,
        "recipeCategory": 1,
        "cookingMethod": 1,
        "images": 1,
        "nutrition.calories": 1,
        "hashtags": 1
    }

    # =========================
    # recipes 조회
    # =========================
    recipes = list(
        recipe_collection.find(
            query,
            projection
        )
        .skip(skip)
        .limit(size)
    )

    total_pages = (
        total + size - 1
    ) // size

    return {
        "page": page,
        "size": size,
        "total": total,
        "totalPages": total_pages,
        "recipes": recipes
    }


# =========================
# 전체 삭제
# =========================
def delete_all_recipes():

    result = recipe_collection.delete_many({})

    return result.deleted_count

def get_recipe_detail(rcp_seq: str):

    recipe = recipe_collection.find_one(
        {"rcpSeq": rcp_seq},
        {"_id": 0}
    )

    if not recipe:
        return {
            "message": "레시피를 찾을 수 없습니다."
        }

    return recipe
