from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient
import os


BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env", override=False)

MONGO_URI = os.getenv("MONGO_URI")

client = (
    MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000
    )
    if MONGO_URI
    else None
)

db = client["youtube_video_rag"] if client else None

summary_collection = (
    db["video_summaries"] if db is not None else None
)

users_collection = db["users"] if db is not None else None

transcript_collection = (
    summary_collection
)
_users_index_ready = False


def get_summary_collection():
    if client is None or summary_collection is None:
        raise RuntimeError(
            "MONGO_URI is missing from backend/.env"
        )

    client.admin.command("ping")

    return summary_collection


def get_users_collection():
    global _users_index_ready
    if client is None or users_collection is None:
        raise RuntimeError("MongoDB user collection is unavailable.")

    if not _users_index_ready:
        users_collection.create_index("email", unique=True)
        _users_index_ready = True
    return users_collection
