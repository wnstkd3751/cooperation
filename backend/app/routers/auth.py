from fastapi import APIRouter, HTTPException, Depends
from app.services import user_service
from app.utils.jwt import (
    create_access_token,
    create_refresh_token,
)
from app.schemas.user import UserUpdateRequest
from upstash_redis import Redis
from app.utils.deps import get_current_user
from app.utils.mail import send_email
import random
import os
from passlib.context import CryptContext
from app.schemas.auth import SignupRequest, LoginRequest, SendCodeRequest, VerifyCodeRequest, ChangePasswordRequest, CheckIdRequest

router = APIRouter(prefix="/auth", tags=["auth"])

redis_client = Redis(
    url=os.getenv("UPSTASH_REDIS_REST_URL"),
    token=os.getenv("UPSTASH_REDIS_REST_TOKEN")
)


# 아이디 중복확인
@router.post("/check-id")
async def check_id(req: CheckIdRequest):
    existing = await user_service.user_collection.find_one({"id": req.id})
    if existing:
        raise HTTPException(status_code=400, detail="이미 사용 중인 아이디입니다")
    return {"message": "사용 가능한 아이디입니다"}


# 회원가입
@router.post("/signup")
async def signup(user: SignupRequest):

    # 아이디 중복 체크
    existing_user = await user_service.user_collection.find_one({"id": user.id})
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디입니다")

    # 이메일 중복 체크
    existing_email = await user_service.user_collection.find_one({"email": user.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="이미 사용 중인 이메일입니다")

    # 유저 생성
    user_id = await user_service.create_user(user)

    return {
        "message": "회원가입 완료",
        "user_id": user_id
    }


# 회원탈퇴
@router.post("/deleteAccount")
async def deleteAccount(user=Depends(get_current_user)):
    res = await user_service.delete_user(user["sub"])
    return {
        "message": "회원탈퇴 완료",
        "res": res
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

    access_token = create_access_token({"sub": str(db_user["id"])})
    refresh_token = create_refresh_token({"sub": str(db_user["id"])})

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
    user_id = redis_client.get(refresh_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="refresh token 만료")
    new_access_token = create_access_token({"sub": user_id.decode()})
    return {"access_token": new_access_token}


@router.get("/{user_id}")
async def get_user(user_id: str):
    user = await user_service.get_user(user_id)
    return user


@router.put("/{user_id}")
async def update_user(user_id: str, req: UserUpdateRequest):
    await user_service.update_user(user_id, req)
    return {"message": "수정 완료"}


@router.post("/send-code")
async def send_code(req: SendCodeRequest):
    code = str(random.randint(100000, 999999))
    redis_client.set(f"verify:{req.email}", code, ex=300)
    send_email(req.email, code)
    return {"message": "인증번호 발송"}


@router.post("/verify-code")
async def verify_code(req: VerifyCodeRequest):
    saved_code = redis_client.get(f"verify:{req.email}")
    if not saved_code:
        raise HTTPException(400, "인증번호 만료")
    if str(saved_code) != req.code:
        raise HTTPException(400, "인증번호 불일치")
    return {"message": "인증 성공"}


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/change-password")
async def change_password(req: ChangePasswordRequest):
    hashed_password = pwd_context.hash(req.password)
    result = await user_service.user_collection.update_one(
        {"email": req.email},
        {"$set": {"password": hashed_password}}
    )
    if result.modified_count == 0:
        raise HTTPException(404, "사용자 없음")
    return {"message": "비밀번호 변경 완료"}