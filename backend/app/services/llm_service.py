import anthropic, os
from dotenv import load_dotenv
from app.ai.prompts import SYSTEM_PROMPT
import app.services.recommend_service as recommend_service

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

async def chat(user_message, ingredients, conversation_history=[]):
    recipes = await recommend_service.recommend(ingredients)

    # 재료 정보 + 추천 레시피 컨텍스트
    context = "=== 유저 보유 재료 ===\n"
    for ingredient in ingredients:
        context += f"- {ingredient['name']} (유통기한: {ingredient['expire_date']})\n"

    context += "\n=== 추천 후보 레시피 ===\n"
    for recipe in recipes[:3]:
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

    return response.content[0].text