import logging

from app.decay import calculate_expiry_weight, get_urgent_ingredients
from app.models import IngredientDocument, RecipeDocument

logger = logging.getLogger(__name__)


class RecommendService:

    async def get_user_ingredients(self, user_id: str) -> list[dict]:
        """유저 보유 재료 + 유통기한 가중치 조회"""
        docs = await IngredientDocument.find(
            IngredientDocument.user_id == user_id
        ).to_list()
        return [
            {
                "name": doc.name,
                "quantity": doc.quantity,
                "unit": doc.unit,
                "expiry_date": doc.expiry_date,
                "weight": calculate_expiry_weight(doc.expiry_date),
            }
            for doc in docs
        ]

    async def score_recipes(
        self, user_ingredients: list[dict], top_k: int = 5
    ) -> list[dict]:
        """
        보유 재료 기반 레시피 스코어링
        score = Σ(매칭된 재료의 유통기한 가중치)
        """
        ingredient_map = {ing["name"]: ing["weight"] for ing in user_ingredients}
        user_names = set(ingredient_map.keys())

        all_recipes = await RecipeDocument.find_all().to_list()
        scored = []

        for recipe in all_recipes:
            recipe_names = {ing.name for ing in recipe.ingredients}
            matched = recipe_names & user_names

            # 주재료가 보유 재료에 없으면 제외
            main_names = {ing.name for ing in recipe.ingredients if ing.is_main}
            if main_names and not (main_names & user_names):
                continue

            score = sum(ingredient_map.get(name, 0) for name in matched)
            if score > 0:
                scored.append({
                    "title": recipe.title,
                    "score": score,
                    "matched_ingredients": list(matched),
                    "recipe_id": str(recipe.id),
                })

        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]

    async def recommend(self, user_id: str) -> dict:
        """
        추천 파이프라인 메인 함수
        반환값을 llm_service.chat()에 그대로 전달
        """
        user_ingredients = await self.get_user_ingredients(user_id)
        urgent = get_urgent_ingredients(user_ingredients)
        candidates = await self.score_recipes(user_ingredients)

        logger.info(
            f"user_id={user_id} | 후보={len(candidates)}개 | 임박재료={len(urgent)}개"
        )

        return {
            "candidate_recipes": candidates,
            "urgent_ingredients": urgent,
            "user_ingredients": user_ingredients,
        }


recommend_service = RecommendService()
