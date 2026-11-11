from app.services.url_transcript import (
    get_transcript,
    extract_video_id
)

from app.services.text_splitter import split_transcript
from app.services.vector_store import create_vector_store




def ingest_video(video_url):

    # Step 1: Extract video ID
    video_id = extract_video_id(video_url)

    print("Video ID:", video_id)

    # Step 2: Extract transcript
    transcript = get_transcript(video_url)

    if not transcript:
        print("Transcript extraction failed!")
        return

    print("Transcript extracted successfully!")

    # Step 3: Split transcript
    chunks = split_transcript(
        transcript,
        video_id
    )

    print("Total chunks:", len(chunks))

    # Step 4: Generate embeddings and store in Pinecone
    create_vector_store(chunks)

    print("Video successfully stored in Pinecone!")


