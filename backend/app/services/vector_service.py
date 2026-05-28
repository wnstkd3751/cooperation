import numpy as np

from db.mongo import (
    ingredients_collection
)

from app.services.embedding_service import (
    create_embedding
)

def cosine_similarity(a, b):

    a = np.array(a)
    b = np.array(b)

    return np.dot(a, b) / (
        np.linalg.norm(a)
        * np.linalg.norm(b)
    )

def find_top_candidates(
    item_name,
    top_k=5
):

    target_embedding = create_embedding(
        item_name
    )

    ingredients = ingredients_collection.find()

    scores = []

    for ingredient in ingredients:

        if "embedding" not in ingredient:
            continue

        score = cosine_similarity(
            target_embedding,
            ingredient["embedding"]
        )

        scores.append({
            "name": ingredient["name"],
            "score": float(score)
        })

    scores.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return scores[:top_k]