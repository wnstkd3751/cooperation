from fastapi import APIRouter, Depends
from pydantic import BaseModel
from bson import ObjectId
import app.services.llm_service as llm_service
import app.services.recommend_service as recommend_service
from app.utils.deps import get_current_user


router = APIRouter(prefix="/recommend", tags=["recommend"])


class ChatRequest(BaseModel):
    user_message: str
    recipes: list
    conversation_history: list = []


class RecommendRequest(BaseModel):
    ingredients: list
    age_group: str = None  # 추가

@router.post("/list")
async def recommend_list(request: RecommendRequest):
    recipes = await recommend_service.recommend(
        request.ingredients,
        request.age_group
    )
    return {
        "recipes": convert_objectid(recipes[:30])
    }


@router.post("/chat")
async def chat(request: ChatRequest, user=Depends(get_current_user)):
    print(request)

    result = await llm_service.chat(
        request.user_message,
        user["sub"],
        request.recipes,
        request.conversation_history
    )
    return {
        "answer": result["answer"],
        "recommended_recipes": result["recommended_recipes"]
    }




def convert_objectid(data):

    if isinstance(data, list):
        return [
            convert_objectid(item)
            for item in data
        ]

    if isinstance(data, dict):
        return {
            key: convert_objectid(value)
            for key, value in data.items()
        }

    if isinstance(data, ObjectId):
        return str(data)

    return data