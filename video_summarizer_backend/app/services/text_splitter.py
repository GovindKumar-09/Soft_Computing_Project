from langchain_text_splitters import RecursiveCharacterTextSplitter


def split_transcript(transcript, video_id):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.create_documents(
        [transcript],
        metadatas=[
            {"video_id": video_id}
        ]
    )

    return chunks