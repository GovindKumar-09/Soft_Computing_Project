from app.services.text_splitter import split_transcript
from app.services.vector_store import create_vector_store


def ingest_video(transcript: str, video_id: str, username: str):

    # Step 1: Split transcript
    chunks = split_transcript(
        transcript,
        video_id,
        username
    )

    print("Total chunks:", len(chunks))

    # Step 2: Generate embeddings and store in Pinecone
    create_vector_store(chunks)

    print("Video successfully stored in Pinecone!")

    return {
        "success": True,
        "video_id": video_id,
        "username": username,
        "total_chunks": len(chunks)
    }
