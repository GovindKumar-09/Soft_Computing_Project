from pydantic import BaseModel, Field


class IngestRequest(BaseModel):
    video_id: str = Field(min_length=1, max_length=64)
    transcript: str = Field(min_length=1, max_length=2_000_000)
