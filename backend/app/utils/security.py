from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def hash_password(password: str):
    return await pwd_context.hash(password)

async def verify_password(plain, hashed):
    return await pwd_context.verify(plain, hashed)