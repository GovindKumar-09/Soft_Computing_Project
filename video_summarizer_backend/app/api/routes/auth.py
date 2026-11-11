import uuid
import json
import os
from fastapi import APIRouter, Response, HTTPException, status, Depends
from app.schemas.auth import RegisterRequest, LoginRequest, AuthSuccessResponse, UserMeResponse
from app.core.security import hash_password, verify_password, create_jwt_token, get_current_user_id

router = APIRouter()

DB_FILE = "users.json"

# File se users load/save karne ke helper functions
def load_users():
    if not os.path.exists(DB_FILE):
        return {}
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {}

def save_users(users):
    with open(DB_FILE, "w") as f:
        json.dump(users, f, indent=4)

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=AuthSuccessResponse)
def register(data: RegisterRequest):
    users_db = load_users()
    
    for user in users_db.values():
        if user["email"] == data.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    hashed_pwd = hash_password(data.password)
    
    new_user = {
        "id": user_id,
        "name": data.name,
        "email": data.email,
        "password": hashed_pwd
    }
    users_db[user_id] = new_user
    save_users(users_db)
    
    return {
        "success": True,
        "message": "User registered successfully",
        "user": {
            "id": user_id,
            "name": data.name,
            "email": data.email
        }
    }

@router.post("/login", response_model=AuthSuccessResponse)
def login(data: LoginRequest, response: Response):
    users_db = load_users()
    matched_user = None
    
    for user in users_db.values():
        if user["email"] == data.email:
            matched_user = user
            break
            
    if not matched_user or not verify_password(data.password, matched_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_jwt_token(matched_user["id"])
    
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=604800,
        samesite="lax",
        secure=False
    )
    
    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": matched_user["id"],
            "name": matched_user["name"],
            "email": matched_user["email"]
        }
    }

@router.get("/me", response_model=UserMeResponse)
def get_me(user_id: str = Depends(get_current_user_id)):
    users_db = load_users()
    user = users_db.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {
        "success": True,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {
        "success": True,
        "message": "Logged out successfully"
    }