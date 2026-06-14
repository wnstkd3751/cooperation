from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.routers import fridge, auth, recipe, ocr, recommend, feedback


app = FastAPI(
    title="FreshKeeper API",
    swagger_ui_parameters={"persistAuthorization": True}
)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="FreshKeeper API",
        version="0.1.0",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer"
        }
    }
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ideal-giggle-jj675qvvwprw2pp79-5173.app.github.dev",
        "https://ideal-fortnight-764xrwqwj7cp6rr-5173.app.github.dev",
        "https://cooperation-4rzk.vercel.app/",
        "https://cooperation-fapgfko3x-junsang-s-projects.vercel.app"
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