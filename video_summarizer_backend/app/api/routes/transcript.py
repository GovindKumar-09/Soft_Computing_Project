from fastapi import APIRouter, HTTPException
from ulid import ULID

from app.schemas.transcript import (
    TranscriptRequest,
    TranscriptResponse
)

from app.services.url_transcript import get_transcript
from app.services.transcript_storage import save_transcript

router = APIRouter()


@router.post(
    "/videos/transcript",
    response_model=TranscriptResponse
)
def fetch_transcript(request: TranscriptRequest):

    try:
        video_url = str(request.video_url)

        # Fetch transcript
        transcript = get_transcript(video_url)

        if not transcript:
            raise HTTPException(
                status_code=404,
                detail="Transcript not available"
            )

        # Generate application video ID
        video_id = str(ULID())

        # Store transcript in MongoDB
        #save_transcript(video_id, transcript)

        return TranscriptResponse(
            success=True,
            video_id=video_id,
            transcript=transcript
        )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch and store transcript"
        )