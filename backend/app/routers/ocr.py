from fastapi import (
    APIRouter,
    UploadFile,
    File
)

from datetime import datetime, timedelta

from app.services.openai_service import (
    extract_receipt_items
)

from app.services.vector_service import (
    find_top_candidates
)

router = APIRouter(prefix="/ocr", tags=["ocr"])

@router.post("/receipt")
async def receipt_ocr(
    image: UploadFile = File(...)
):

    image_bytes = await image.read()

    ocr_result = extract_receipt_items(
        image_bytes
    )

    print(ocr_result)

    results = []

    today = datetime.now()

    for item in ocr_result["items"]:

        candidates = await find_top_candidates(
            item["name"]
        )

        if not candidates:
            continue

        best_match = candidates[0]

        expire_date = (
            today +
            timedelta(
                days=best_match[
                    "shelf_life_days"
                ]
            )
        )

        results.append({

            "ocr_name":
                item["name"],

            "name":
                best_match["name"],

            "score":
                best_match["score"],

            "quantity":
                item.get(
                    "quantity",
                    1
                ),

            "category":
                best_match["category"],

            "image":
                best_match["image"],

            "purchase_date":
                today.strftime(
                    "%Y-%m-%d"
                ),

            "expire_date":
                expire_date.strftime(
                    "%Y-%m-%d"
                ),

            "shelf_life_days":
                best_match[
                    "shelf_life_days"
                ],

            "candidates":
                candidates
        })

    return {
        "items": results
    }