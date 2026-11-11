from fastapi import APIRouter, HTTPException, Depends

from app.schemas.ingest import IngestRequest
from app.services.ingest import ingest_video
from app.core.auth import get_current_user
from app.core.database import get_summary_collection


router = APIRouter()


@router.post("/videos/ingest")
def ingest_video_route(request: IngestRequest, current_user=Depends(get_current_user)):

    if not request.transcript.strip():
        raise HTTPException(
            status_code=400,
            detail="Transcript cannot be empty"
        )

    if not request.video_id.strip():
        raise HTTPException(status_code=400, detail="Video ID is required")

    try:
        lecture = get_summary_collection().find_one({
            "video_id": request.video_id,
            "username": current_user["email"]
        }, {"_id": 1})
        if not lecture:
            raise HTTPException(status_code=404, detail="Lecture not found.")

        result = ingest_video(
            transcript=request.transcript,
            video_id=request.video_id,
            username=current_user["email"]
        )

        return result

    except HTTPException:
        raise
    except Exception as error:
        import logging
        logging.getLogger(__name__).exception("Lecture indexing failed")
        raise HTTPException(
            status_code=503,
            detail="Lecture indexing is temporarily unavailable. Please retry."
        ) from error
