from fastapi import FastAPI

from app.api.routes.manual_transcript import router as manual_transcript_router
from app.api.routes.transcript import router as transcript_router
'''from app.api.routes.ingest import router as ingest_router
from app.api.routes.summary import router as summary_router
from app.api.routes.quiz import router as quiz_router
from app.api.routes.chat import router as chat_router'''

app = FastAPI(
    title="YouTube Video RAG API",
    description="Transcript Extraction, Video Summarization, Quiz Generation and RAG Chat",
    version="1.0.0"
)

app.include_router(transcript_router, prefix="/api", tags=["Transcript"])
'''app.include_router(ingest_router, prefix="/api", tags=["Ingestion"])
app.include_router(summary_router, prefix="/api", tags=["Summarization"])
app.include_router(quiz_router, prefix="/api", tags=["Quiz"])
app.include_router(chat_router, prefix="/api", tags=["RAG Chat"])'''
app.include_router(
    manual_transcript_router,
    prefix="/api",
    tags=["Manual Transcript"]
)

@app.get("/")
def home():
    return {
        "success": True,
        "message": "YouTube Video RAG API is running!"
    }
