
import logging

from fastapi import APIRouter, HTTPException, Depends

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import chat_with_video
from app.core.auth import get_current_user
from app.core.database import get_summary_collection


router = APIRouter()

logger = logging.getLogger(__name__)


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, current_user=Depends(get_current_user)):

    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    if not request.video_id.strip():
        raise HTTPException(
            status_code=400,
            detail="Lecture ID is required."
        )

    try:

        lecture = get_summary_collection().find_one({
            "video_id": request.video_id,
            "username": current_user["email"]
        }, {"_id": 1})
        if not lecture:
            raise HTTPException(status_code=404, detail="Lecture not found.")

        answer = chat_with_video(
            video_id=request.video_id,
            username=current_user["email"],
            question=request.question
        )

        return {
            "success": True,
            "answer": answer
        }

    except HTTPException:
        raise

    except Exception as error:

        logger.exception("RAG chat failed")

        # Avoid returning provider errors or configuration details to clients.
        raise HTTPException(
            status_code=503,
            detail="Lecture chat is temporarily unavailable. Check the AI and vector database configuration, then try again."
        ) from error
