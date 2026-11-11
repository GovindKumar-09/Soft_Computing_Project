"""Groq speech-to-text adapter and transcript normalization."""

import mimetypes
import re
from functools import lru_cache
from pathlib import Path

from groq import Groq

from app.core.config import GROQ_API_KEY, GROQ_TRANSCRIPTION_MODEL


@lru_cache(maxsize=1)
def get_transcription_client():
    if not GROQ_API_KEY:
        return None
    return Groq(api_key=GROQ_API_KEY)


def _value(item, key, default=None):
    return item.get(key, default) if isinstance(item, dict) else getattr(item, key, default)


def combine_transcript(transcript: str) -> str:
    """Remove timestamp-only lines and return searchable continuous text."""
    if not transcript:
        return ""

    lines = []
    for line in transcript.splitlines():
        line = line.strip()
        if line and not re.match(
            r"^\[?\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d+)?\]?$",
            line
        ):
            lines.append(line)
    return " ".join(lines).strip()


def transcribe_audio(audio_path: Path) -> dict:
    client = get_transcription_client()
    if client is None:
        raise RuntimeError("Groq API key is not configured.")

    mime_type = mimetypes.guess_type(str(audio_path))[0] or "audio/mpeg"
    with audio_path.open("rb") as audio_file:
        result = client.audio.transcriptions.create(
            file=(audio_path.name, audio_file, mime_type),
            model=GROQ_TRANSCRIPTION_MODEL,
            response_format="verbose_json",
            timestamp_granularities=["segment"],
            temperature=0.0
        )

    raw_text = _value(result, "text", "") or ""
    segments = [
        {
            "start": float(_value(segment, "start", 0) or 0),
            "end": float(_value(segment, "end", 0) or 0),
            "text": str(_value(segment, "text", "")).strip()
        }
        for segment in (_value(result, "segments", []) or [])
    ]
    return {
        "text": combine_transcript(raw_text),
        "segments": segments,
        "language": _value(result, "language")
    }
