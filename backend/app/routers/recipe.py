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
async def import_recipe_api():

    inserted_count = await recipe_service.import_recipes()

    return {
        "message": "레시피 저장 완료",
        "insertedCount": inserted_count
    }

# =========================
# 통합 조회
# =========================
@router.get("")
async def get_recipe_api(
    page: int = 1,
    size: int = 16,

    # 추가
    category: Optional[str] = None,
    keyword: Optional[str] = None,
    searchType: Optional[str] = None
):
    print("카테고리:", category)
    print("키워드:", keyword)
    print("검색 타입:", searchType)

    return await recipe_service.get_recipes(
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
async def delete_recipe_api():

    deleted_count = await recipe_service.delete_all_recipes()

    return {
        "message": "전체 삭제 완료",
        "deletedCount": deleted_count
    }

# =========================
# 상세 레시피
# =========================
@router.get("/{rcp_seq}")
async def get_recipe_detail_api(rcp_seq: str):

    return await recipe_service.get_recipe_detail(
        rcp_seq
    )