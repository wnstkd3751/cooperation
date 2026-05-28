import asyncio

from db.mongo import (
    ingredients_collection
)

from app.services.embedding_service import (
    create_embeddings
)

BATCH_SIZE = 100

async def update_embeddings():

    ingredients = []

    async for item in ingredients_collection.find():

        ingredients.append(item)

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

            await ingredients_collection.update_one(
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