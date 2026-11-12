from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document


def split_transcript(transcript: str, video_id: str, username: str):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_text(transcript)

    documents = []

    for chunk in chunks:

        documents.append(
            Document(
                page_content=chunk,
                metadata={
                    "video_id": video_id,
                    "username": username
                }
            )
        )

    return documents