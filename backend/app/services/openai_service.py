from openai import OpenAI
import base64
import json
import os

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def extract_receipt_items(image_bytes):

    base64_image = base64.b64encode(
        image_bytes
    ).decode("utf-8")

    response = client.chat.completions.create(
        model="gpt-4.1-mini",

        response_format={
            "type": "json_object"
        },

        messages=[

            {
                "role": "system",
                "content": """
                영수증에서 식재료만 추출해라.

                반드시 JSON으로 반환:

                {
                  "items": [
                    {
                      "name": "",
                      "quantity": 1,
                      "category": ""
                    }
                  ]
                }

                category는 반드시 아래 중 하나:

                채소
                과일
                육류
                수산물
                유제품
                가공식품
                음료
                조미료
                기타
                """
            },

            {
                "role": "user",
                "content": [

                    {
                        "type": "text",
                        "text": "영수증 분석"
                    },

                    {
                        "type": "image_url",
                        "image_url": {
                            "url":
                            f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],

        temperature=0
    )

    return json.loads(
        response.choices[0].message.content
    )