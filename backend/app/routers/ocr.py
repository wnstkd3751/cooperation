from fastapi import APIRouter, UploadFile, File
from app.services.clova_ocr_service import process_clova_ocr

router = APIRouter(
    prefix="/ocr",
    tags=["OCR"]
)

@router.post("/clova")
async def clova_ocr(image: UploadFile = File(...)):
    result = await process_clova_ocr(image)
    return result