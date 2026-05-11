# backend/db/mongo.py

from motor.motor_asyncio import AsyncIOMotorClient

import os

from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

# =========================
# Mongo 연결
# =========================
client = AsyncIOMotorClient(MONGO_URL)

db = client["demo"]

# =========================
# Collections
# =========================
fridge_collection = db["fridge_items"]

recipe_collection = db["recipes"]