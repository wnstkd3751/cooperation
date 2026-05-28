from fastapi import (
    APIRouter,
    UploadFile,
    File
)

import json

from app.services.openai_service import (
    extract_receipt_items
)

from app.services.vector_service import (
    find_top_candidates
)

from app.services.normalize_service import (
    gpt_normalize
)

router = APIRouter()

@router.post("/ocr/receipt")
async def receipt_ocr(
    image: UploadFile = File(...)
):

    image_bytes = await image.read()

    ocr_result = extract_receipt_items(
        image_bytes
    )

    results = []

    for item in ocr_result["items"]:

        candidates = find_top_candidates(
            item["name"]
        )

        normalized = gpt_normalize(
            item["name"],
            candidates
        )

        normalized_data = json.loads(
            normalized
        )

        results.append({

            "ocr_name":
                item["name"],

            "matched_name":
                normalized_data[
                    "normalized_name"
                ],

            "quantity":
                item.get(
                    "quantity",
                    1
                ),

            "category":
                item.get(
                    "category",
                    "기타"
                ),

            "candidates":
                candidates
        })

    return {
        "items": results
    }