# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import fridge, auth, recipe, ocr, recommend, feedback


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ideal-giggle-jj675qvvwprw2pp79-5173.app.github.dev",
        "https://ideal-fortnight-764xrwqwj7cp6rr-5173.app.github.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fridge.router)
app.include_router(auth.router)
app.include_router(recipe.router)
app.include_router(ocr.router)
app.include_router(recommend.router)
app.include_router(feedback.router)