
import os
import re
import uuid
import logging
import mimetypes

from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from groq import Groq
from ulid import ULID
from starlette.concurrency import run_in_threadpool


# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env", override=True)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "whisper-large-v3-turbo"
)

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

UPLOAD_DIR = BASE_DIR / "uploads"
VIDEO_DIR = UPLOAD_DIR / "videos"
AUDIO_DIR = UPLOAD_DIR / "audio"

VIDEO_DIR.mkdir(parents=True, exist_ok=True)
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

MAX_VIDEO_SIZE = 500 * 1024 * 1024
MAX_AUDIO_SIZE = 25 * 1024 * 1024

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)

groq_client = (
    Groq(api_key=GROQ_API_KEY)
    if GROQ_API_KEY
    else None
)


# --------------------------------------------------
# TEAM ROUTERS AND SERVICES
# --------------------------------------------------

from app.api.routes.ingest import router as ingest_router
from app.api.routes.summary import router as summary_router
from app.api.routes.chat import router as chat_router
from app.api.routes.auth import router as auth_router
from app.core.auth import get_current_user

from app.services.summary import generate_summary
from app.services.ingest import ingest_video
from app.services.quiz import generate_quiz

from app.core import database


# --------------------------------------------------
# FASTAPI APPLICATION
# --------------------------------------------------

app = FastAPI(
    title="AI Lecture Learning Platform",
    description=(
        "Lecture transcription, structured summaries "
        "and RAG-based learning."
    ),
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# --------------------------------------------------
# REGISTER ROUTERS
# --------------------------------------------------

app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Authentication"]
)

app.include_router(
    ingest_router,
    prefix="/api",
    tags=["Ingestion"]
)

app.include_router(
    summary_router,
    prefix="/api",
    tags=["Lectures and Summary"]
)

app.include_router(
    chat_router,
    prefix="/api",
    tags=["RAG Chat"]
)


# --------------------------------------------------
# DATABASE HELPER
# --------------------------------------------------

def get_summary_collection():
    """
    Supports the team's database.py implementation
    with either a getter or a summary_collection variable.
    """

    getter = getattr(
        database,
        "get_summary_collection",
        None
    )

    if callable(getter):
        return getter()

    collection = getattr(
        database,
        "summary_collection",
        None
    )

    if collection is None:
        raise RuntimeError(
            "MongoDB summary collection is unavailable. "
            "Check MONGO_URI in backend/.env."
        )

    mongo_client = getattr(
        database,
        "client",
        None
    )

    if mongo_client is not None:
        mongo_client.admin.command("ping")

    return collection


# --------------------------------------------------
# REQUEST SCHEMA
# --------------------------------------------------

class ManualTranscriptRequest(BaseModel):
    transcript: str


# --------------------------------------------------
# COMMON FUNCTIONS
# --------------------------------------------------

def get_value(item, key, default=None):

    if isinstance(item, dict):
        return item.get(key, default)

    return getattr(item, key, default)


def combine_transcript(transcript: str) -> str:
    """
    Removes standalone timestamp lines and
    combines the transcript into continuous text.
    """

    if not transcript:
        return ""

    lines = transcript.splitlines()
    text_lines = []

    for line in lines:

        line = line.strip()

        if re.match(
            r"^\[?\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d+)?\]?$",
            line
        ):
            continue

        if line:
            text_lines.append(line)

    return " ".join(text_lines).strip()


async def save_upload(
    file: UploadFile,
    destination: Path,
    max_size: int
):
    """
    Saves uploaded files in chunks to avoid
    loading the complete file into memory.
    """

    total_size = 0

    try:

        with destination.open("wb") as buffer:

            while True:

                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                total_size += len(chunk)

                if total_size > max_size:
                    raise HTTPException(
                        status_code=413,
                        detail="Uploaded file exceeds the size limit."
                    )

                buffer.write(chunk)

        if total_size == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty."
            )

        return total_size

    except Exception:
        destination.unlink(missing_ok=True)
        raise


# --------------------------------------------------
# GROQ TRANSCRIPTION
# --------------------------------------------------

def transcribe_audio(audio_path: Path):

    if not groq_client:
        raise RuntimeError(
            "Groq API key is not configured."
        )

    mime_type = (
        mimetypes.guess_type(str(audio_path))[0]
        or "audio/mpeg"
    )

    try:

        with audio_path.open("rb") as audio_file:

            result = groq_client.audio.transcriptions.create(
                file=(
                    audio_path.name,
                    audio_file,
                    mime_type
                ),
                model=GROQ_MODEL,
                response_format="verbose_json",
                timestamp_granularities=["segment"],
                temperature=0.0
            )

        raw_text = get_value(
            result,
            "text",
            ""
        ) or ""

        final_text = combine_transcript(raw_text)

        raw_segments = get_value(
            result,
            "segments",
            []
        ) or []

        segments = []

        for segment in raw_segments:

            segments.append({
                "start": float(
                    get_value(segment, "start", 0) or 0
                ),
                "end": float(
                    get_value(segment, "end", 0) or 0
                ),
                "text": str(
                    get_value(segment, "text", "")
                ).strip()
            })

        return {
            "text": final_text,
            "segments": segments,
            "language": get_value(
                result,
                "language",
                None
            )
        }

    except Exception:
        logger.exception("Groq transcription failed")
        raise


# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def home():

    return {
        "success": True,
        "message": "AI Lecture Learning Platform API is running!"
    }


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/api/health")
def health_check():

    mongo_connected = False

    try:
        get_summary_collection()
        mongo_connected = True

    except Exception:
        logger.exception("MongoDB connection check failed")

    groq_configured = groq_client is not None
    auth_configured = len(os.getenv("JWT_SECRET", "")) >= 32
    pinecone_configured = bool(os.getenv("PINECONE_API_KEY") and os.getenv("PINECONE_INDEX_NAME"))
    gemini_configured = bool(os.getenv("GEMINI_API_KEY"))
    healthy = all((groq_configured, mongo_connected, auth_configured, pinecone_configured, gemini_configured))

    return {
        "success": healthy,
        "message": "Backend is healthy" if healthy else "One or more required services are unavailable",
        "groq_configured": groq_configured,
        "mongo_connected": mongo_connected,
        "auth_configured": auth_configured,
        "pinecone_configured": pinecone_configured,
        "gemini_configured": gemini_configured
    }


# --------------------------------------------------
# UPLOAD ORIGINAL LECTURE
# --------------------------------------------------

@app.post("/api/lectures/upload")
async def upload_lecture(
    lecture: UploadFile = File(...),
    title: str = Form(...),
    subject: str = Form(...),
    current_user: dict = Depends(get_current_user)
):

    if not lecture.filename:
        raise HTTPException(
            status_code=400,
            detail="No lecture file selected."
        )

    extension = Path(lecture.filename).suffix.lower()

    allowed_extensions = {
        ".mp4",
        ".mov",
        ".avi",
        ".mkv",
        ".webm",
        ".mp3",
        ".wav",
        ".m4a"
    }

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format."
        )

    if not title.strip() or not subject.strip():
        raise HTTPException(
            status_code=400,
            detail="Title and subject are required."
        )

    lecture_id = str(ULID())

    stored_name = f"{lecture_id}{extension}"

    video_path = VIDEO_DIR / stored_name

    try:

        # Save original video
        await save_upload(
            lecture,
            video_path,
            MAX_VIDEO_SIZE
        )

        # Connect to MongoDB
        collection = await run_in_threadpool(
            get_summary_collection
        )

        now = datetime.now(timezone.utc)

        username = current_user["email"]

        # IMPORTANT:
        # created_at is only in $setOnInsert.
        # It must NOT also appear in $set.
        lecture_document = {
            "video_id": lecture_id,
            "username": username,
            "title": title.strip(),
            "subject": subject.strip(),
            "original_name": Path(lecture.filename).name,
            "video_stored_name": stored_name,
            "status": "uploaded",
            "summary_status": "pending",
            "updated_at": now
        }

        await run_in_threadpool(
            lambda: collection.update_one(
                {"video_id": lecture_id},
                {
                    "$set": lecture_document,
                    "$setOnInsert": {
                        "created_at": now
                    }
                },
                upsert=True
            )
        )

        logger.info(
            "Lecture saved in MongoDB: %s",
            lecture_id
        )

        return {
            "success": True,
            "id": lecture_id,
            "lecture": {
                "id": lecture_id,
                "title": title.strip(),
                "subject": subject.strip(),
                "username": username,
                "originalName": Path(lecture.filename).name,
                "videoStoredName": stored_name
            },
            "message": "Lecture uploaded successfully."
        }

    except HTTPException:
        video_path.unlink(missing_ok=True)
        raise

    except Exception as error:

        video_path.unlink(missing_ok=True)

        logger.exception("Lecture upload failed")

        raise HTTPException(status_code=500, detail="Lecture upload failed. Please retry.") from error

    finally:
        await lecture.close()


# --------------------------------------------------
# AUDIO UPLOAD + TRANSCRIPT + SUMMARY
# --------------------------------------------------

@app.post("/api/lectures/audio")
async def upload_audio(
    audio: UploadFile = File(...),
    lectureId: str = Form(...),
    videoStoredName: str = Form(default=""),
    current_user: dict = Depends(get_current_user)
):

    if not groq_client:
        raise HTTPException(
            status_code=503,
            detail="Groq API key is not configured."
        )

    if not audio.filename:
        raise HTTPException(
            status_code=400,
            detail="No audio file received."
        )

    extension = (
        Path(audio.filename).suffix.lower()
        or ".mp3"
    )

    audio_path = AUDIO_DIR / f"{uuid.uuid4()}{extension}"

    try:

        # Connect to MongoDB
        collection = await run_in_threadpool(
            get_summary_collection
        )

        # Verify lecture metadata exists
        username = current_user["email"]
        lecture_document = await run_in_threadpool(
            lambda: collection.find_one({
                "video_id": lectureId,
                "username": username
            })
        )

        if not lecture_document:
            raise HTTPException(
                status_code=404,
                detail="Lecture not found. Upload the lecture first."
            )

        logger.info(
            "Processing audio for lecture: %s",
            lectureId
        )

        # STEP 1: Save extracted audio temporarily
        await save_upload(
            audio,
            audio_path,
            MAX_AUDIO_SIZE
        )

        # STEP 2: Generate combined transcript
        transcript = await run_in_threadpool(
            transcribe_audio,
            audio_path
        )

        final_text = transcript["text"]

        if not final_text:
            raise HTTPException(
                status_code=422,
                detail="No speech was detected in this audio."
            )

        logger.info(
            "Transcript generated for: %s",
            lectureId
        )

        # STEP 3: Save transcript before summary generation
        now = datetime.now(timezone.utc)

        await run_in_threadpool(
            lambda: collection.update_one(
                {"video_id": lectureId},
                {
                    "$set": {
                        "transcript": final_text,
                        "language": transcript.get("language"),
                        "status": "transcribed",
                        "summary_status": "processing",
                        "updated_at": now
                    }
                }
            )
        )

        # STEP 4: Prepare lecture information
        lecture_metadata = {
            "title": lecture_document.get("title"),
            "subject": lecture_document.get("subject"),
            "original_name": lecture_document.get("original_name"),
            "video_stored_name": (
                lecture_document.get("video_stored_name")
                or videoStoredName
            )
        }

        # STEP 5: Generate structured AI summary
        try:

            summary_result = await run_in_threadpool(
                generate_summary,
                final_text,
                lectureId,
                username,
                lecture_metadata
            )

        except Exception:

            logger.exception(
                "Summary generation failed for %s",
                lectureId
            )

            await run_in_threadpool(
                lambda: collection.update_one(
                    {"video_id": lectureId},
                    {
                        "$set": {
                            "status": "summary_failed",
                            "summary_status": "failed",
                            "updated_at": datetime.now(timezone.utc)
                        }
                    }
                )
            )

            raise

        # STEP 6: Extract generated summary
        summary_text = summary_result.get(
            "summary",
            ""
        )

        summary_data = (
            summary_result.get("summary_data")
            or summary_result.get("summaryData")
            or {}
        )

        # STEP 7: Confirm final processing status
        await run_in_threadpool(
            lambda: collection.update_one(
                {"video_id": lectureId},
                {
                    "$set": {
                        "summary": summary_text,
                        "summary_data": summary_data,
                        "status": "completed",
                        "summary_status": "completed",
                        "updated_at": datetime.now(timezone.utc)
                    }
                }
            )
        )

        logger.info(
            "Transcript and summary saved: %s",
            lectureId
        )

        # STEP 8: Index transcript in Pinecone for RAG chat
        rag_status = "pending"
        rag_chunks = 0

        try:
            rag_result = await run_in_threadpool(
                ingest_video,
                final_text,
                lectureId,
                username
            )
            rag_chunks = rag_result.get("total_chunks", 0)
            rag_status = "completed"

            await run_in_threadpool(
                lambda: collection.update_one(
                    {"video_id": lectureId},
                    {
                        "$set": {
                            "rag_status": "completed",
                            "rag_chunks": rag_chunks,
                            "updated_at": datetime.now(timezone.utc)
                        }
                    }
                )
            )

            logger.info(
                "Pinecone RAG indexing completed: %s (%d chunks)",
                lectureId,
                rag_chunks
            )

        except Exception:
            rag_status = "failed"
            logger.exception(
                "Pinecone RAG indexing failed for %s (non-fatal)",
                lectureId
            )

            await run_in_threadpool(
                lambda: collection.update_one(
                    {"video_id": lectureId},
                    {
                        "$set": {
                            "rag_status": "failed",
                            "updated_at": datetime.now(timezone.utc)
                        }
                    }
                )
            )

        # STEP 9: Return data to React
        return {
            "success": True,
            "lectureId": lectureId,
            "transcript": transcript,
            "summary": summary_text,
            "summaryData": summary_data,
            "ragIngestion": {
                "status": rag_status,
                "chunks": rag_chunks
            },
            "message": "Transcript and summary generated successfully."
        }

    except HTTPException:
        raise

    except Exception as error:

        logger.exception(
            "Lecture audio processing failed"
        )

        raise HTTPException(status_code=500, detail="Lecture processing failed. Check service health and retry.") from error

    finally:

        audio_path.unlink(missing_ok=True)

        await audio.close()


# --------------------------------------------------
# QUIZ GENERATION
# --------------------------------------------------

@app.get("/api/lectures/{lecture_id}/quiz")
async def get_lecture_quiz(
    lecture_id: str,
    num_questions: int = 10,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a fresh MCQ quiz from the saved lecture transcript.
    num_questions: how many questions to generate (default 10, max 20).
    """
    try:
        collection = await run_in_threadpool(get_summary_collection)

        document = await run_in_threadpool(
            lambda: collection.find_one({"video_id": lecture_id, "username": current_user["email"]})
        )

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Lecture not found."
            )

        transcript = document.get("transcript", "")

        if not transcript:
            raise HTTPException(
                status_code=422,
                detail="No transcript available for this lecture. "
                       "Process the lecture first."
            )

        num_questions = min(max(int(num_questions), 3), 20)

        lecture_metadata = {
            "title": document.get("title", "Untitled Lecture"),
            "subject": document.get("subject", "General")
        }

        result = await run_in_threadpool(
            generate_quiz,
            transcript,
            lecture_metadata,
            num_questions
        )

        return {
            "success": True,
            "lectureId": lecture_id,
            "title": document.get("title", "Untitled Lecture"),
            "subject": document.get("subject", "General"),
            "questions": result["questions"],
            "total": result["total"]
        }

    except HTTPException:
        raise

    except Exception as error:
        logger.exception("Quiz generation failed for %s", lecture_id)
        raise HTTPException(status_code=503, detail="Quiz generation is temporarily unavailable. Please retry.") from error


# --------------------------------------------------
# MANUAL TRANSCRIPT
# --------------------------------------------------

@app.post("/api/videos/manual-transcript")
def save_manual_transcript(
    request: ManualTranscriptRequest,
    current_user: dict = Depends(get_current_user)
):

    final_transcript = combine_transcript(
        request.transcript
    )

    if not final_transcript:
        raise HTTPException(
            status_code=400,
            detail="Transcript cannot be empty."
        )

    return {
        "success": True,
        "transcript": final_transcript,
        "message": "Transcript processed successfully."
    }


# --------------------------------------------------
# SERVE UPLOADED VIDEO
# --------------------------------------------------

@app.get("/api/lectures/video/{filename}")
def get_video(filename: str, current_user: dict = Depends(get_current_user)):

    safe_name = Path(filename).name

    file_path = VIDEO_DIR / safe_name

    collection = get_summary_collection()
    if not collection.find_one({"video_stored_name": safe_name, "username": current_user["email"]}):
        raise HTTPException(status_code=404, detail="Video not found.")

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Video not found."
        )

    return FileResponse(file_path)
