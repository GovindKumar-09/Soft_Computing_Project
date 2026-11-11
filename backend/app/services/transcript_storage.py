
from app.core.database import get_summary_collection


def save_transcript(video_id: str, transcript: str):
    get_summary_collection().update_one(
        {"video_id": video_id},
        {
            "$set": {
                "transcript": transcript
            }
        }
    )

    return True


def get_transcript(video_id: str):
    document = get_summary_collection().find_one(
        {"video_id": video_id},
        {"transcript": 1, "_id": 0}
    )
    return document
