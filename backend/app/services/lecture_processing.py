"""Coordinates transcription, summary creation, and RAG indexing."""

import logging
from datetime import datetime, timezone
from pathlib import Path

from app.core.database import get_summary_collection
from app.services.ingest import ingest_video
from app.services.summary import generate_summary
from app.services.transcription import transcribe_audio

logger = logging.getLogger(__name__)


class LectureNotFoundError(Exception):
    pass


class NoSpeechDetectedError(Exception):
    pass


def process_lecture_audio(
    audio_path: Path,
    lecture_id: str,
    username: str,
    video_stored_name: str = ""
) -> dict:
    collection = get_summary_collection()
    lecture = collection.find_one({"video_id": lecture_id, "username": username})
    if not lecture:
        raise LectureNotFoundError("Lecture not found. Upload the lecture first.")

    logger.info("Processing audio for lecture: %s", lecture_id)
    transcript = transcribe_audio(audio_path)
    transcript_text = transcript["text"]
    if not transcript_text:
        raise NoSpeechDetectedError("No speech was detected in this audio.")

    now = datetime.now(timezone.utc)
    collection.update_one(
        {"video_id": lecture_id, "username": username},
        {"$set": {
            "transcript": transcript_text,
            "language": transcript.get("language"),
            "status": "transcribed",
            "summary_status": "processing",
            "updated_at": now
        }}
    )

    metadata = {
        "title": lecture.get("title"),
        "subject": lecture.get("subject"),
        "original_name": lecture.get("original_name"),
        "video_stored_name": lecture.get("video_stored_name") or video_stored_name
    }

    try:
        summary = generate_summary(transcript_text, lecture_id, username, metadata)
    except Exception:
        logger.exception("Summary generation failed for %s", lecture_id)
        collection.update_one(
            {"video_id": lecture_id, "username": username},
            {"$set": {
                "status": "summary_failed",
                "summary_status": "failed",
                "updated_at": datetime.now(timezone.utc)
            }}
        )
        raise

    summary_text = summary.get("summary", "")
    summary_data = summary.get("summary_data") or summary.get("summaryData") or {}
    collection.update_one(
        {"video_id": lecture_id, "username": username},
        {"$set": {
            "summary": summary_text,
            "summary_data": summary_data,
            "status": "completed",
            "summary_status": "completed",
            "updated_at": datetime.now(timezone.utc)
        }}
    )
    logger.info("Transcript and summary saved: %s", lecture_id)

    rag_status = "failed"
    rag_chunks = 0
    try:
        rag_result = ingest_video(transcript_text, lecture_id, username)
        rag_chunks = rag_result.get("total_chunks", 0)
        rag_status = "completed"
        logger.info("RAG indexing completed for %s (%d chunks)", lecture_id, rag_chunks)
    except Exception:
        logger.exception("RAG indexing failed for %s (non-fatal)", lecture_id)

    collection.update_one(
        {"video_id": lecture_id, "username": username},
        {"$set": {
            "rag_status": rag_status,
            "rag_chunks": rag_chunks,
            "updated_at": datetime.now(timezone.utc)
        }}
    )

    return {
        "success": True,
        "lectureId": lecture_id,
        "transcript": transcript,
        "summary": summary_text,
        "summaryData": summary_data,
        "ragIngestion": {"status": rag_status, "chunks": rag_chunks},
        "message": "Transcript and summary generated successfully."
    }
