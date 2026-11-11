import secrets

from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader

from app.core.config import CHAT_API_KEY


api_key_header = APIKeyHeader(
    name="X-API-Key",
    auto_error=False
)


def verify_api_key(api_key: str = Security(api_key_header)):

    if not CHAT_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Server API key is not configured"
        )

    if not api_key or not secrets.compare_digest(
        api_key, CHAT_API_KEY
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid API key"
        )

    return True