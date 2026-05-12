import anthropic
from app.ai.prompts import SYSTEM_PROMPT
import app.services.recommend_service as recommend_service

client = anthropic.Anthropic(api_key="my_key")

def chat(user_message, ingredients):
    recipes = recommend_service.recommend(ingredients)

    context = ""
    for recipe in recipes[:3]:
        context += f"- {recipe['name']} (점수: {recipe['score']})\n"

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1500,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": f"추천 후보:\n{context}\n\n유저 질문: {user_message}"
            }
        ]
    )

    return response.content[0].text