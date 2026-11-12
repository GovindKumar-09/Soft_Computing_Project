"""FastAPI application assembly and process-wide health endpoints."""

import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import (
    FRONTEND_URL,
    GEMINI_API_KEY,
    GROQ_API_KEY,
    PINECONE_API_KEY,
    PINECONE_INDEX_NAME,
)
from app.api.routes.auth import router as auth_router
from app.api.routes.chat import router as chat_router
from app.api.routes.ingest import router as ingest_router
from app.api.routes.lectures import router as lectures_router
from app.api.routes.summary import router as summary_router
from app.core import database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Lecture Learning Platform",
    description="Authenticated lecture transcription, study notes, quizzes, and RAG chat.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys([
        FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ])),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(lectures_router, prefix="/api", tags=["Lectures"])
app.include_router(ingest_router, prefix="/api", tags=["Ingestion"])
app.include_router(summary_router, prefix="/api", tags=["Lectures and Summary"])
app.include_router(chat_router, prefix="/api", tags=["RAG Chat"])


@app.get("/")
def home():
    return {
        "success": True,
        "message": "AI Lecture Learning Platform API is running!",
    }


@app.get("/api/health")
def health_check():
    mongo_connected = False
    try:
        database.get_summary_collection()
        mongo_connected = True
    except Exception:
        logger.exception("MongoDB connection check failed")

    auth_configured = len(os.getenv("JWT_SECRET", "")) >= 32
    pinecone_configured = bool(PINECONE_API_KEY and PINECONE_INDEX_NAME)
    healthy = all((
        bool(GROQ_API_KEY),
        mongo_connected,
        auth_configured,
        pinecone_configured,
        bool(GEMINI_API_KEY),
    ))

    return {
        "success": healthy,
        "message": "Backend is healthy" if healthy else "One or more required services are unavailable",
        "groq_configured": bool(GROQ_API_KEY),
        "mongo_connected": mongo_connected,
        "auth_configured": auth_configured,
        "pinecone_configured": pinecone_configured,
        "gemini_configured": bool(GEMINI_API_KEY),
    }
