from fastapi import APIRouter
from pydantic import BaseModel
import app.services.llm_service as llm_service

router = APIRouter(prefix="/recommend", tags=["recommend"])

class ChatRequest(BaseModel):
    user_message: str
    ingredients: list

@router.post("/chat")
async def chat(request: ChatRequest):
    answer = await llm_service.chat(request.user_message, request.ingredients)
    return {"answer": answer}