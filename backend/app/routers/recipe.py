from fastapi import APIRouter

from app.services import recipe_service

router = APIRouter(
    prefix="/recipes",
    tags=["Recipes"]
)


# =========================
# 레시피 저장
# =========================
@router.post("/import")
def import_recipe_api():

    inserted_count = recipe_service.import_recipes()

    return {
        "message": "레시피 저장 완료",
        "insertedCount": inserted_count
    }


# =========================
# 전체 조회
# =========================
@router.get("")
def get_recipe_api(
    page: int = 1,
    size: int = 16
):

    return recipe_service.get_recipes(page, size)





# =========================
# 검색
# =========================
@router.get("/search")
def search_recipe_api(
    keyword: str,
    page: int = 1,
    size: int = 10
):

    return recipe_service.search_recipes(
        keyword,
        page,
        size
    )

# =========================
# 카테고리
# =========================
@router.get("/category/{category}")
def get_recipe_by_category_api(
    category: str,
    page: int = 1,
    size: int = 10
):

    return recipe_service.get_recipes_by_category(
        category,
        page,
        size
    )

# =========================
# 재료
# =========================
@router.get("/ingredient/search")
def ingredient_search_api(
    ingredient: str,
    page: int = 1,
    size: int = 10
):

    return recipe_service.search_by_ingredient(
        ingredient,
        page,
        size
    )

# =========================
# 전체 삭제
# =========================
@router.delete("/delete")
def delete_recipe_api():

    deleted_count = recipe_service.delete_all_recipes()

    return {
        "message": "전체 삭제 완료",
        "deletedCount": deleted_count
    }

# =========================
# 상세 레시피
# =========================
@router.get("/{rcp_seq}")
def get_recipe_detail_api(rcp_seq: str):

    return recipe_service.get_recipe_detail(rcp_seq)