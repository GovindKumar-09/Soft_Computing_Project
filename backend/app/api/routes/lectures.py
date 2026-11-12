"""Lecture upload, processing, transcript, quiz, and media endpoints."""

import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from starlette.concurrency import run_in_threadpool
from ulid import ULID

from app.core.auth import get_current_user
from app.core.config import (
    AUDIO_DIR,
    GROQ_API_KEY,
    MAX_AUDIO_SIZE,
    MAX_VIDEO_SIZE,
    VIDEO_DIR,
)
from app.core.database import get_summary_collection
from app.schemas.lecture import ManualTranscriptRequest
from app.services.file_storage import save_upload
from app.services.lecture_processing import (
    LectureNotFoundError,
    NoSpeechDetectedError,
    process_lecture_audio,
)
from app.services.quiz import generate_quiz
from app.services.transcription import combine_transcript

router = APIRouter()
logger = logging.getLogger(__name__)

ALLOWED_LECTURE_EXTENSIONS = {
    ".mp4", ".mov", ".avi", ".mkv", ".webm", ".mp3", ".wav", ".m4a"
}


@router.post("/lectures/upload")
async def upload_lecture(
    lecture: UploadFile = File(...),
    title: str = Form(...),
    subject: str = Form(...),
    current_user: dict = Depends(get_current_user),
):
    if not lecture.filename:
        raise HTTPException(status_code=400, detail="No lecture file selected.")

    extension = Path(lecture.filename).suffix.lower()
    if extension not in ALLOWED_LECTURE_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file format.")
    if not title.strip() or not subject.strip():
        raise HTTPException(status_code=400, detail="Title and subject are required.")

    lecture_id = str(ULID())
    stored_name = f"{lecture_id}{extension}"
    video_path = VIDEO_DIR / stored_name
    username = current_user["email"]

    try:
        await save_upload(lecture, video_path, MAX_VIDEO_SIZE)
        collection = await run_in_threadpool(get_summary_collection)
        now = datetime.now(timezone.utc)
        await run_in_threadpool(
            lambda: collection.update_one(
                {"video_id": lecture_id},
                {
                    "$set": {
                        "video_id": lecture_id,
                        "username": username,
                        "title": title.strip(),
                        "subject": subject.strip(),
                        "original_name": Path(lecture.filename).name,
                        "video_stored_name": stored_name,
                        "status": "uploaded",
                        "summary_status": "pending",
                        "updated_at": now,
                    },
                    "$setOnInsert": {"created_at": now},
                },
                upsert=True,
            )
        )
        logger.info("Lecture saved in MongoDB: %s", lecture_id)
        return {
            "success": True,
            "id": lecture_id,
            "lecture": {
                "id": lecture_id,
                "title": title.strip(),
                "subject": subject.strip(),
                "username": username,
                "originalName": Path(lecture.filename).name,
                "videoStoredName": stored_name,
            },
            "message": "Lecture uploaded successfully.",
        }
    except HTTPException:
        video_path.unlink(missing_ok=True)
        raise
    except Exception as error:
        video_path.unlink(missing_ok=True)
        logger.exception("Lecture upload failed")
        raise HTTPException(
            status_code=500,
            detail="Lecture upload failed. Please retry.",
        ) from error
    finally:
        await lecture.close()


@router.post("/lectures/audio")
async def upload_audio(
    audio: UploadFile = File(...),
    lectureId: str = Form(...),
    videoStoredName: str = Form(default=""),
    current_user: dict = Depends(get_current_user),
):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=503, detail="Groq API key is not configured.")
    if not audio.filename:
        raise HTTPException(status_code=400, detail="No audio file received.")

    extension = Path(audio.filename).suffix.lower() or ".mp3"
    audio_path = AUDIO_DIR / f"{uuid.uuid4()}{extension}"
    try:
        await save_upload(audio, audio_path, MAX_AUDIO_SIZE)
        return await run_in_threadpool(
            process_lecture_audio,
            audio_path,
            lectureId,
            current_user["email"],
            videoStoredName,
        )
    except LectureNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except NoSpeechDetectedError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except HTTPException:
        raise
    except Exception as error:
        logger.exception("Lecture audio processing failed")
        raise HTTPException(
            status_code=500,
            detail="Lecture processing failed. Check service health and retry.",
        ) from error
    finally:
        audio_path.unlink(missing_ok=True)
        await audio.close()


@router.get("/lectures/{lecture_id}/quiz")
async def get_lecture_quiz(
    lecture_id: str,
    num_questions: int = 10,
    current_user: dict = Depends(get_current_user),
):
    try:
        collection = await run_in_threadpool(get_summary_collection)
        document = await run_in_threadpool(
            lambda: collection.find_one({
                "video_id": lecture_id,
                "username": current_user["email"],
            })
        )
        if not document:
            raise HTTPException(status_code=404, detail="Lecture not found.")

        transcript = document.get("transcript", "")
        if not transcript:
            raise HTTPException(
                status_code=422,
                detail="No transcript available for this lecture. Process the lecture first.",
            )

        count = min(max(int(num_questions), 3), 20)
        metadata = {
            "title": document.get("title", "Untitled Lecture"),
            "subject": document.get("subject", "General"),
        }
        result = await run_in_threadpool(generate_quiz, transcript, metadata, count)
        return {
            "success": True,
            "lectureId": lecture_id,
            "title": metadata["title"],
            "subject": metadata["subject"],
            "questions": result["questions"],
            "total": result["total"],
        }
    except HTTPException:
        raise
    except Exception as error:
        logger.exception("Quiz generation failed for %s", lecture_id)
        raise HTTPException(
            status_code=503,
            detail="Quiz generation is temporarily unavailable. Please retry.",
        ) from error


@router.post("/videos/manual-transcript")
def save_manual_transcript(
    request: ManualTranscriptRequest,
    current_user: dict = Depends(get_current_user),
):
    del current_user  # Authentication protects this endpoint.
    transcript = combine_transcript(request.transcript)
    if not transcript:
        raise HTTPException(status_code=400, detail="Transcript cannot be empty.")
    return {
        "success": True,
        "transcript": transcript,
        "message": "Transcript processed successfully.",
    }


@router.get("/lectures/video/{filename}")
def get_video(
    filename: str,
    current_user: dict = Depends(get_current_user),
):
    safe_name = Path(filename).name
    collection = get_summary_collection()
    lecture = collection.find_one({
        "video_stored_name": safe_name,
        "username": current_user["email"],
    })
    if not lecture:
        raise HTTPException(status_code=404, detail="Video not found.")

    file_path = VIDEO_DIR / safe_name
    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="Video not found.")
    return FileResponse(file_path)
