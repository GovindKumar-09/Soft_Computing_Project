
from fastapi import APIRouter, HTTPException
from ulid import ULID
import re

from app.schemas.transcript import ManualTranscriptRequest
from app.services.transcript_storage import save_transcript

router = APIRouter()


def combine_transcript(transcript: str):

    lines = transcript.splitlines()

    text_lines = []

    for line in lines:
        line = line.strip()

        # Skip timestamp lines like 0:00, 1:23, 10:25
        if re.match(r"^\d{1,2}:\d{2}(?::\d{2})?$", line):
            continue

        if line:
            text_lines.append(line)

    return " ".join(text_lines)


@router.post("/videos/manual-transcript")
def save_manual_transcript(request: ManualTranscriptRequest):

    if not request.transcript.strip():
        raise HTTPException(
            status_code=400,
            detail="Transcript cannot be empty"
        )

    # Combine transcript and remove timestamps
    final_transcript = combine_transcript(request.transcript)

    video_id = str(ULID())

    # Save combined transcript in MongoDB
    save_transcript(video_id, final_transcript)

    return {
        "success": True,
        "video_id": video_id,
        "transcript": final_transcript,
        "message": "Transcript saved successfully"
    }


