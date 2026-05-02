import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.api.deps import CurrentUser
from app.services.llm_service import llm_service
from app.services.recommend_service import recommend_service

router = APIRouter(prefix="/recommend", tags=["recommend"])
logger = logging.getLogger(__name__)


class ChatMessage(BaseModel):
    role: str       # "user" | "assistant"
    content: str


class RecommendChatRequest(BaseModel):
    messages: list[ChatMessage]


class RecommendResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=RecommendResponse)
async def recommend_chat(
    body: RecommendChatRequest, current_user: CurrentUser
) -> RecommendResponse:
    """
    대화형 레시피 추천
    흐름:
      1. recommend_service: 보유 재료/유통기한 기반 후보 레시피 스코어링
      2. llm_service: 결과를 컨텍스트로 받아 자연어 응답 생성
    """
    try:
        context = await recommend_service.recommend(user_id=str(current_user.id))
        messages = [{"role": m.role, "content": m.content} for m in body.messages]
        reply = await llm_service.chat(messages=messages, **context)
        return RecommendResponse(reply=reply)
    except Exception as e:
        logger.error(f"추천 처리 실패: {e}")
        raise HTTPException(
            status_code=500, detail="추천 처리 중 오류가 발생했습니다."
        )
