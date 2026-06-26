from pymongo import MongoClient
import os

client = MongoClient(
    os.getenv("MONGO_URL")
)

db = client["demo"]

recipes_collection = db["recipes"]

updated_count = 0

recipes = list(
    recipes_collection.find({})
)

print(
    f"전체 레시피 수: {len(recipes)}"
)

for recipe in recipes:

    update_data = {}

    # =====================
    # 대표 이미지
    # =====================

    images = recipe.get(
        "images",
        {}
    )

    main = images.get("main")
    detail = images.get("detail")

    if (
        isinstance(main, str)
        and main.startswith("http://")
    ):
        update_data["images.main"] = (
            main.replace(
                "http://",
                "https://"
            )
        )

    if (
        isinstance(detail, str)
        and detail.startswith("http://")
    ):
        update_data["images.detail"] = (
            detail.replace(
                "http://",
                "https://"
            )
        )

    # =====================
    # 조리과정 이미지
    # =====================

    steps = recipe.get(
        "steps",
        []
    )

    updated_steps = []
    step_changed = False

    for step in steps:

        image_url = step.get(
            "imageUrl"
        )

        if (
            isinstance(image_url, str)
            and image_url.startswith("http://")
        ):

            step["imageUrl"] = (
                image_url.replace(
                    "http://",
                    "https://"
                )
            )

            step_changed = True

        updated_steps.append(step)

    if step_changed:

        update_data["steps"] = (
            updated_steps
        )

    # =====================
    # 저장
    # =====================

    if update_data:

        recipes_collection.update_one(
            {
                "_id": recipe["_id"]
            },
            {
                "$set": update_data
            }
        )

        updated_count += 1

        print(
            f"✔ {recipe.get('recipeName')}"
        )

print(
    f"\n완료! {updated_count}개 수정"
)