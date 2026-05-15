from fastapi import APIRouter
from pydantic import BaseModel
import app.services.llm_service as llm_service

router = APIRouter(prefix="/recommend", tags=["recommend"])

class ChatRequest(BaseModel):
    user_message: str
    ingredients: list

@router.post("/chat")
def chat(request: ChatRequest):
    answer = llm_service.chat(request.user_message, request.ingredients)
    return {"answer": answer}