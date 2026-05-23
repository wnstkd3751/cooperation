from fastapi import APIRouter
from pydantic import BaseModel
import app.services.llm_service as llm_service
import app.services.recommend_service as recommend_service

router = APIRouter(prefix="/recommend", tags=["recommend"])


class ChatRequest(BaseModel):
    user_message: str
    ingredients: list
    conversation_history: list = []


class RecommendRequest(BaseModel):
    ingredients: list


@router.post("/chat")
async def chat(request: ChatRequest):
    answer = await llm_service.chat(
        request.user_message,
        request.ingredients,
        request.conversation_history
    )
    return {"answer": answer}


@router.post("/list")
async def recommend_list(request: RecommendRequest):
    recipes = await recommend_service.recommend(request.ingredients)
    return {"recipes": recipes[:10]}