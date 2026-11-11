import base64
import hashlib
import hmac
import json
import os
import time

from bson import ObjectId
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.database import get_users_collection


bearer_scheme = HTTPBearer(auto_error=False)


def _b64encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def _b64decode(value: str) -> bytes:
    return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


def _secret() -> bytes:
    value = os.getenv("JWT_SECRET", "")
    if len(value) < 32:
        raise HTTPException(
            status_code=503,
            detail="Authentication is not configured. Set a strong JWT_SECRET in backend/.env.",
        )
    return value.encode("utf-8")


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 310_000)
    return f"pbkdf2_sha256$310000${_b64encode(salt)}${_b64encode(digest)}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, iterations, salt, expected = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        actual = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), _b64decode(salt), int(iterations)
        )
        return hmac.compare_digest(actual, _b64decode(expected))
    except (ValueError, TypeError):
        return False


def create_access_token(user_id: str) -> str:
    now = int(time.time())
    header = _b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode())
    payload = _b64encode(json.dumps({"sub": user_id, "iat": now, "exp": now + 60 * 60 * 12}, separators=(",", ":")).encode())
    message = f"{header}.{payload}".encode("ascii")
    signature = _b64encode(hmac.new(_secret(), message, hashlib.sha256).digest())
    return f"{header}.{payload}.{signature}"


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    unauthorized = HTTPException(
        status_code=401,
        detail="Sign in to access this resource.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        if credentials is None or credentials.scheme.lower() != "bearer":
            raise unauthorized
        token = credentials.credentials
        header, payload, signature = token.split(".", 2)
        message = f"{header}.{payload}".encode("ascii")
        expected = _b64encode(hmac.new(_secret(), message, hashlib.sha256).digest())
        if not hmac.compare_digest(signature, expected):
            raise unauthorized
        claims = json.loads(_b64decode(payload))
        if int(claims.get("exp", 0)) <= int(time.time()):
            raise unauthorized
        user_id = claims.get("sub", "")
        if not ObjectId.is_valid(user_id):
            raise unauthorized
    except HTTPException:
        raise
    except Exception:
        raise unauthorized

    try:
        user = get_users_collection().find_one({"_id": ObjectId(user_id)})
    except Exception as error:
        raise HTTPException(status_code=503, detail="Authentication service is temporarily unavailable.") from error
    if not user:
        raise unauthorized
    return {"id": str(user["_id"]), "email": user["email"], "name": user["name"]}
