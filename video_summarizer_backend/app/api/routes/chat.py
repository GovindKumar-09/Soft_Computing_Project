from fastapi import APIRouter, Depends, HTTPException

from app.core.security import verify_api_key
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import chat_with_video


router = APIRouter()


@router.post(
    "/videos/{video_id}/chat",
    response_model=ChatResponse
)
def chat(
    video_id: str,
    request: ChatRequest,
    authorized: bool = Depends(verify_api_key)
):

    try:

        answer = chat_with_video(
            video_id,
            request.question
        )

        return ChatResponse(
            success=True,
            answer=answer
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )