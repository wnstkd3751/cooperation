from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from db.mongo import db

router = APIRouter(prefix="/feedback", tags=["feedback"])

class FeedbackRequest(BaseModel):
    user_id: str
    recipe_id: str
    recipe_name: str
    action: str          # click / save / complete / rating
    rating: float = None # rating일 때만 1~5

@router.post("/")
async def save_feedback(request: FeedbackRequest):
    feedback_collection = db["feedback_log"]

    data = {
        "user_id": request.user_id,
        "recipe_id": request.recipe_id,
        "recipe_name": request.recipe_name,
        "action": request.action,
        "rating": request.rating,
        "created_at": datetime.utcnow()
    }

    await feedback_collection.insert_one(data)

    return {"message": "피드백 저장 완료"}