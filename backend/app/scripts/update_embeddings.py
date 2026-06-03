import asyncio
import base64
import json
import os

from pymongo import MongoClient
from openai import OpenAI

# =====================================
# Mongo
# =====================================

mongo_client = MongoClient(
    os.getenv("MONGO_URL")
)

db = mongo_client["demo"]

ingredients_collection = db["ingredient"]

# =====================================
# OpenAI
# =====================================

openai_client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

BATCH_SIZE = 100

# =====================================
# 카테고리 이미지 프롬프트
# =====================================

CATEGORY_PROMPTS = {

    "채소":
        "Flat vector icon of vegetables, carrot onion broccoli, mobile food app icon",

    "과일":
        "Flat vector icon of fruits, apple banana orange, mobile food app icon",

    "육류":
        "Flat vector icon of meat, beef pork chicken, mobile food app icon",

    "수산물":
        "Flat vector icon of seafood, shrimp salmon fish, mobile food app icon",

    "유제품":
        "Flat vector icon of milk cheese yogurt, mobile food app icon",

    "두부":
        "Flat vector icon of tofu cubes, mobile food app icon",

    "곡류":
        "Flat vector icon of rice wheat grain, mobile food app icon",

    "조미료":
        "Flat vector icon of soy sauce salt pepper, mobile food app icon",

    "기타":
        "Flat vector icon of grocery basket, mobile food app icon"
}

# =====================================
# 이미지 생성
# =====================================

def generate_image(
    filepath,
    prompt
):

    result = (
        openai_client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size="1024x1024"
        )
    )

    image_base64 = (
        result.data[0].b64_json
    )

    image_bytes = (
        base64.b64decode(
            image_base64
        )
    )

    with open(
        filepath,
        "wb"
    ) as f:

        f.write(
            image_bytes
        )

# =====================================
# 카테고리 이미지 생성
# =====================================

def generate_category_images():

    os.makedirs(
        "static/categories",
        exist_ok=True
    )

    filename_map = {

        "채소": "vegetable.png",
        "과일": "fruit.png",
        "육류": "meat.png",
        "수산물": "seafood.png",
        "유제품": "dairy.png",
        "두부": "tofu.png",
        "곡류": "grain.png",
        "조미료": "seasoning.png",
        "기타": "etc.png"
    }

    image_map = {}

    for category, prompt in (
        CATEGORY_PROMPTS.items()
    ):

        filepath = (
            f"static/categories/"
            f"{filename_map[category]}"
        )

        if not os.path.exists(
            filepath
        ):

            print(
                f"[IMAGE] 생성중 {category}"
            )

            generate_image(
                filepath,
                prompt
            )

        image_map[category] = (
            "/" + filepath
        )

    return image_map

# =====================================
# 임베딩
# =====================================

def create_embeddings(texts):

    response = (
        openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=texts
        )
    )

    return [
        item.embedding
        for item in response.data
    ]

# =====================================
# GPT 분류
# =====================================

def classify_batch(names):

    prompt = f"""
다음 식재료 목록을 분석하세요.

반드시 JSON 배열만 반환하세요.


카테고리는 반드시 하나만 선택하세요.
카테고리 후보:

- 채소
- 과일
- 육류
- 수산물
- 유제품
- 두부
- 곡류
- 조미료
- 기타

유통기한은 냉장보관 기준 일수입니다.

반환 예시:

[
 {{
   "name":"양파",
   "category":"채소",
   "shelf_life_days":30
 }}
]

식재료 목록:

{json.dumps(names, ensure_ascii=False)}
"""

    response = (
        openai_client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0
        )
    )

    content = (
        response
        .choices[0]
        .message
        .content
    )

    return json.loads(content)

# =====================================
# 업데이트
# =====================================

async def update_ingredients():

    print(
        "\n=== 카테고리 이미지 생성 ==="
    )

    category_image_map = (
        generate_category_images()
    )

    print(
        "\n=== 재료 조회 ==="
    )

    ingredients = list(
        ingredients_collection.find({})
    )

    print(
        f"전체 개수: {len(ingredients)}"
    )

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

        print(
            f"\n=== 처리중 {i} ~ {i+len(batch)} ==="
        )

        try:

            embeddings = (
                create_embeddings(
                    names
                )
            )

            classifications = (
                classify_batch(
                    names
                )
            )

            classification_map = {

                item["name"]: item
                for item in classifications
            }

            for doc, embedding in zip(
                batch,
                embeddings
            ):

                meta = (
                    classification_map.get(
                        doc["name"],
                        {}
                    )
                )

                category = (
                    meta.get(
                        "category",
                        "기타"
                    )
                )

                shelf_life_days = (
                    meta.get(
                        "shelf_life_days",
                        7
                    )
                )

                image = (
                    category_image_map.get(
                        category,
                        category_image_map["기타"]
                    )
                )

                ingredients_collection.update_one(
                    {
                        "_id": doc["_id"]
                    },
                    {
                        "$set": {

                            "embedding":
                                embedding,

                            "category":
                                category,

                            "shelf_life_days":
                                shelf_life_days,

                            "image":
                                image
                        }
                    }
                )

                print(
                    f"✔ {doc['name']} "
                    f"| {category} "
                    f"| {shelf_life_days}일"
                )

        except Exception as e:

            print(
                f"[ERROR] {e}"
            )

    print(
        "\n=== 완료 ==="
    )

# =====================================
# 실행
# =====================================

if __name__ == "__main__":

    asyncio.run(
        update_ingredients()
    )