import requests
import time
import json

from fastapi import UploadFile
from app.utils.parser import parse_receipt_text

CLOVA_SECRET_KEY = "YOUR_SECRET_KEY"
CLOVA_API_URL = "YOUR_API_URL"


async def process_clova_ocr(image: UploadFile):

    image_bytes = await image.read()

    headers = {
        "X-OCR-SECRET": CLOVA_SECRET_KEY
    }

    payload = {
        "version": "V2",
        "requestId": "receipt-request",
        "timestamp": int(time.time() * 1000),
        "images": [
            {
                "format": "jpg",
                "name": "receipt"
            }
        ]
    }

    files = [
        ("message", (None, json.dumps(payload), "application/json")),
        ("file", (image.filename, image_bytes, image.content_type))
    ]

    response = requests.post(
        CLOVA_API_URL,
        headers=headers,
        files=files
    )

    result = response.json()

    # =========================
    # OCR 줄 단위 추출
    # =========================
    lines = []

    try:
        for image in result["images"]:
            for field in image["fields"]:

                text = field["inferText"]

                lines.append(text)

    except Exception as e:
        print("OCR ERROR:", e)

    # =========================
    # 영수증 파싱
    # =========================
    parsed_items = parse_receipt_text(lines)

    return {
        "items": parsed_items
    }