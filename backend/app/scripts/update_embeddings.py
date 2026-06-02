import asyncio

from pymongo import MongoClient
from openai import OpenAI

import os

client = MongoClient(os.getenv("MONGO_URL"))
db = client["demo"]
ingredients_collection = db["ingredient"]

BATCH_SIZE = 100

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def create_embeddings(texts):

    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )

    return [
        item.embedding
        for item in response.data
    ]

async def update_embeddings():

    ingredients = list(
    ingredients_collection.find({})
)

    print("전체 개수:", len(ingredients))

    for i in range(
        0,
        len(ingredients),
        BATCH_SIZE
    ):

        batch = ingredients[
            i:i+BATCH_SIZE
        ]

        names = [
            item["name"]
            for item in batch
        ]

        print(f"""
        처리중:
        {i} ~ {i+len(batch)}
        """)

        embeddings = create_embeddings(
            names
        )

        for item, embedding in zip(
            batch,
            embeddings
        ):

            ingredients_collection.update_one(
            {
                "_id": item["_id"]
            },
            {
                "$set": {
                    "embedding": embedding
                }
            }
        )

    print("완료")


if __name__ == "__main__":

    asyncio.run(
        update_embeddings()
    )