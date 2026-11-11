import re
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from pymongo.errors import DuplicateKeyError

from app.core.auth import create_access_token, get_current_user, hash_password, verify_password
from app.core.database import get_users_collection


router = APIRouter()


class AuthCredentials(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=8, max_length=128)


class RegisterRequest(AuthCredentials):
    name: str = Field(min_length=1, max_length=100)


def _public_user(user):
    return {"id": str(user["_id"]), "email": user["email"], "name": user["name"]}


def _token_response(user):
    return {"access_token": create_access_token(str(user["_id"])), "token_type": "bearer", "user": _public_user(user)}


def _users():
    try:
        return get_users_collection()
    except Exception as error:
        raise HTTPException(status_code=503, detail="Authentication service is temporarily unavailable.") from error


@router.post("/register", status_code=201)
def register(request: RegisterRequest):
    email = request.email.strip().lower()
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        raise HTTPException(status_code=422, detail="Enter a valid email address.")
    name = request.name.strip()
    if not name:
        raise HTTPException(status_code=422, detail="Name is required.")

    users = _users()
    user = {
        "email": email,
        "name": name,
        "password_hash": hash_password(request.password),
        "created_at": datetime.now(timezone.utc),
    }
    try:
        result = users.insert_one(user)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    user["_id"] = result.inserted_id
    return _token_response(user)


@router.post("/login")
def login(request: AuthCredentials):
    email = request.email.strip().lower()
    user = _users().find_one({"email": email})
    if not user or not verify_password(request.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Email or password is incorrect.")
    return _token_response(user)


@router.get("/me")
def me(user=Depends(get_current_user)):
    return {"user": user}
