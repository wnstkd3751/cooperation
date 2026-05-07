from fastapi import APIRouter, HTTPException
from app.schemas.user import UserCreate, UserLogin
from app.services import user_service
from app.utils.jwt import create_access_token
from db.redis import redis_client

router = APIRouter(prefix="/auth", tags=["auth"])


# 🔥 회원가입
@router.post("/signup")
def signup(user: UserCreate):

    # ✅ 아이디 중복 체크
    existing_user = user_service.user_collection.find_one({"id": user.id})
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디입니다")

    # ✅ 유저 생성
    user_id = user_service.create_user(user)

    return {
        "message": "회원가입 완료",
        "user_id": user_id
    }


# 로그인
@router.post("/login")
def login(user: UserLogin):

    # ✅ 유저 인증
    db_user = user_service.authenticate_user(user.id, user.password)

    if not db_user:
        raise HTTPException(status_code=401, detail="아이디 또는 비밀번호 오류")

    # ✅ JWT 생성
    token = create_access_token({
        "user_id": str(db_user["_id"])
    })

    # ✅ Redis 세션 저장 (1시간)
    redis_client.set(token, str(db_user["_id"]), ex=3600)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": str(db_user["_id"])
    }