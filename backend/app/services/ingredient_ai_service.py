# app/services/ingredient_ai_service.py

from openai import OpenAI
from pymongo import MongoClient
import numpy as np
import os

# -----------------------------
# OpenAI
# -----------------------------

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# -----------------------------
# MongoDB
# -----------------------------
MONGO_URL = os.getenv("MONGO_URL")

mongo_client = MongoClient(MONGO_URL)

db = mongo_client["demo"]

ingredient_col = db["ingredient"]


# -----------------------------
# embedding 생성
# -----------------------------

def get_embedding(text: str):

    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )

    return response.data[0].embedding


# -----------------------------
# cosine similarity
# -----------------------------

def cosine_similarity(a, b):

    a = np.array(a)
    b = np.array(b)

    return np.dot(a, b) / (
        np.linalg.norm(a) *
        np.linalg.norm(b)
    )


# -----------------------------
# ingredient 전체 embedding 저장
# 최초 1회만 실행
# -----------------------------

def save_all_embeddings():

    ingredients = ingredient_col.find()

    for ingredient in ingredients:

        name = ingredient["name"]

        # 이미 embedding 있으면 스킵
        if "embedding" in ingredient:
            continue

        try:

            embedding = get_embedding(name)

            ingredient_col.update_one(
                {
                    "_id": ingredient["_id"]
                },
                {
                    "$set": {
                        "embedding": embedding
                    }
                }
            )

            print(f"완료: {name}")

        except Exception as e:

            print(f"실패: {name}")
            print(e)


# -----------------------------
# 가장 비슷한 재료 찾기
# -----------------------------

async def change_ingredient(name: str):

    try:

        # 사용자 입력 embedding
        user_embedding = get_embedding(name)

        # DB 재료 전체 조회
        ingredients = ingredient_col.find({
            "embedding": {
                "$exists": True
            }
        })

        best_score = -1
        best_name = None

        for ingredient in ingredients:

            db_embedding = ingredient["embedding"]

            score = cosine_similarity(
                user_embedding,
                db_embedding
            )

            if score > best_score:

                best_score = score
                best_name = ingredient["name"]

        print(f"""
입력 재료: {name}
추천 재료: {best_name}
유사도: {best_score}
""")

        return best_name

    except Exception as e:

        print(e)

        return name

if __name__ == "__main__":
    save_all_embeddings()