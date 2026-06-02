import numpy as np

from db.mongo import (
    ingredients_collection
)

from app.services.embedding_service import (
    create_embeddings
)


def cosine_similarity(a, b):

    a = np.array(a)
    b = np.array(b)

    return float(

        np.dot(a, b)

        /

        (

            np.linalg.norm(a)

            *

            np.linalg.norm(b)

        )

    )


async def find_top_candidates(
    item_name,
    top_k=5
):

    target_embedding = np.array(

        create_embeddings(
            [item_name]
        )[0]

    )

    ingredients = await (
        ingredients_collection
        .find({})
        .to_list(length=None)
    )

    scores = []

    for ingredient in ingredients:

        embedding = ingredient.get(
            "embedding"
        )

        if not embedding:
            continue

        try:

            score = cosine_similarity(
                target_embedding,
                embedding
            )

            scores.append({

                "name":
                    ingredient["name"],

                "score":
                    score

            })

        except Exception as e:

            print(
                "[ERROR]",
                ingredient.get("name"),
                e
            )

    scores.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    print(
        "[DEBUG]",
        item_name,
        scores[:5]
    )

    return scores[:top_k]