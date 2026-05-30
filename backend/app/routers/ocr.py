from fastapi import (
    APIRouter,
    UploadFile,
    File
)

from app.services.openai_service import (
    extract_receipt_items
)

from app.services.vector_service import (
    find_top_candidates
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

        # 가장 유사한 재료
        best_match = candidates[0]

        results.append({

            "ocr_name":
                item["name"],

            "matched_name":
                best_match["name"],

            "score":
                best_match["score"],

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