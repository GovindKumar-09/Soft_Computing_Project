from pydantic import BaseModel, Field


class ManualTranscriptRequest(BaseModel):
    transcript: str = Field(min_length=1, max_length=2_000_000)
