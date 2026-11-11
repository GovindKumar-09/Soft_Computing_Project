from pydantic import BaseModel, EmailStr
from typing import Optional

class UserData(BaseModel):
    id: str
    name: str
    email: EmailStr

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthSuccessResponse(BaseModel):
    success: bool
    message: str
    user: Optional[UserData] = None

class UserMeResponse(BaseModel):
    success: bool
    user: UserData