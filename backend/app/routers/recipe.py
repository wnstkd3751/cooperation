from fastapi import APIRouter
from typing import Optional

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
# 통합 조회
# =========================
@router.get("")
def get_recipe_api(
    page: int = 1,
    size: int = 16,

    # 추가
    category: Optional[str] = None,
    keyword: Optional[str] = None,
    searchType: Optional[str] = None
):

    return recipe_service.get_recipes(
        page=page,
        size=size,
        category=category,
        keyword=keyword,
        searchType=searchType
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

    return recipe_service.get_recipe_detail(
        rcp_seq
    )