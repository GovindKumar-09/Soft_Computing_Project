from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.auth import router as auth_router

app = FastAPI(title="YouTube Video RAG API")

# Ensure withCredentials cookies work fine with CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth router prefix matches /api/auth
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])

# ... remaining routes (transcript, ingest, summary, quiz, chat) ...