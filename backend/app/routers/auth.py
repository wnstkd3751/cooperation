from fastapi import APIRouter, HTTPException
from app.services import user_service
from app.utils.jwt import (
    create_access_token,
    create_refresh_token,
    decode_token
)
from upstash_redis import Redis
import os
from app.schemas.auth import SignupRequest, LoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])

redis_client = Redis(
    url=os.getenv("UPSTASH_REDIS_REST_URL"),
    token=os.getenv("UPSTASH_REDIS_REST_TOKEN")
)


# 회원가입
@router.post("/signup")
async def signup(user: SignupRequest):

    # 아이디 중복 체크
    existing_user = await user_service.user_collection.find_one({"id": user.id})
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디입니다")

    # 유저 생성
    user_id = await user_service.create_user(user)

    return {
        "message": "회원가입 완료",
        "user_id": user_id
    }


# 로그인
@router.post("/login")
async def login(user: LoginRequest):

    db_user = await user_service.authenticate_user(
        user.id,
        user.password
    )

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="아이디 또는 비밀번호 오류"
        )

    # access token
    access_token =  create_access_token({
        "sub": str(db_user["id"])
    })

    # refresh token
    refresh_token = create_refresh_token({
        "sub": str(db_user["id"])
    })

    # redis 저장
    redis_client.set(
        refresh_token,
        str(db_user["id"]),
        ex=60 * 60 * 24 * 7
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user_id": str(db_user["id"])
    }

@router.post("/refresh")
async def refresh_token(refresh_token: str):

    # redis 확인
    user_id = redis_client.get(refresh_token)

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="refresh token 만료"
        )

    new_access_token = create_access_token({
        "sub": user_id.decode()
    })

    return {
        "access_token": new_access_token
    }