from pydantic import BaseModel, HttpUrl

class TranscriptRequest(BaseModel):
    video_url: HttpUrl

class TranscriptResponse(BaseModel):
    success: bool
    video_id: str
    transcript: str