from app.core.database import transcript_collection

def save_transcript(video_id, transcript):

    document = {
        "video_id": video_id,
        "transcript": transcript
    }

    transcript_collection.insert_one(document)