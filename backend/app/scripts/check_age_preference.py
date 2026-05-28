from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URL"))
db = client["demo"]
collection = db["age_group_preference"]

# 19_29 데이터 확인
result = list(collection.find({"age_group": "19_29"}, {"_id": 0}))
for item in result:
    print(item)

print(f"\n총 {collection.count_documents({})}개")
client.close()