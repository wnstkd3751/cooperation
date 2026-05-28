import pandas as pd
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

CSV_PATH = "app/data/age_group_preference_processed.csv"
MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = "demo"
COLLECTION_NAME = "age_group_preference"


def main():
    # CSV 읽기
    df = pd.read_csv(CSV_PATH)
    df = df.where(pd.notnull(df), None)
    records = df.to_dict("records")

    # MongoDB 연결
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]

    # 기존 데이터 삭제 후 새로 삽입
    collection.delete_many({})
    collection.insert_many(records)

    # 인덱스 생성 (조회 속도 향상)
    collection.create_index(
        [("age_group", 1), ("food_category", 1)],
        unique=True
    )

    print(f"✅ {len(records)}개 데이터 저장 완료")
    client.close()


if __name__ == "__main__":
    main()