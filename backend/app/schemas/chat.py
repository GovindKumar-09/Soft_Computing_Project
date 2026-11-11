
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=4000)
    video_id: str = Field(min_length=1, max_length=64)


class ChatResponse(BaseModel):
    success: bool
    answer: str
