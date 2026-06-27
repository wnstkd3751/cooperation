import anthropic, os
from dotenv import load_dotenv
from app.ai.prompts import SYSTEM_PROMPT
from db.mongo import fridge_collection
import app.services.recommend_service as recommend_service

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

async def chat(user_message, user_id, recipes, conversation_history=[]):

    ingredients = await fridge_collection.find(
        {"user_id": user_id}
    ).to_list(None)

    # 재료 정보 + 추천 레시피 컨텍스트
    context = "=== 유저 보유 재료 ===\n"
    for ingredient in ingredients:
        context += f"- {ingredient['name']} (유통기한: {ingredient['expire_date']})\n"

    context += "\n=== 추천 후보 레시피 ===\n"
    for recipe in recipes[:30]:
        context += f"- {recipe['recipeName']} (점수: {recipe['score']})\n"

    # 대화 기록 + 현재 메시지
    messages = [
        *conversation_history,
        {
            "role": "user",
            "content": f"추천 후보:\n{context}\n\n유저 질문: {user_message}"
        }
    ]

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1500,
        system=SYSTEM_PROMPT,
        messages=messages
    )

    answer = response.content[0].text

    # 답변에 실제 등장한 레시피만 카드로 (없으면 점수 상위 3개로 폴백)
    matched = [r for r in recipes[:30] if r["recipeName"] in answer]
    matched.sort(key=lambda r: answer.index(r["recipeName"]))  # 답변에 나온 순서대로
    cards = matched[:3] if matched else recipes[:3]

    return {
        "answer": answer,
        "recommended_recipes": cards
    }