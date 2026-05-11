from fastapi import Header, HTTPException
from app.utils.jwt import decode_token

def get_current_user(authorization: str = Header(None)):

    if not authorization:
        raise HTTPException(status_code=401, detail="토큰 없음")

    token = authorization.replace("Bearer ", "")

    payload = decode_token(token)

    print(payload)

    if not payload:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰")

    return payload