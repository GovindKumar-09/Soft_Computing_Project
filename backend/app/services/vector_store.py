import os
from functools import lru_cache

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone

from app.core.config import (
    GEMINI_API_KEY,
    PINECONE_API_KEY,
    PINECONE_INDEX_NAME,
)

@lru_cache(maxsize=1)
def get_index_host():
    """Resolve the data-plane host once, avoiding a lookup per vector store."""
    host = os.getenv("PINECONE_HOST")
    if not host:
        if not PINECONE_INDEX_NAME or not PINECONE_API_KEY:
            raise RuntimeError("Pinecone index name and API key must be configured.")
        host = Pinecone(api_key=PINECONE_API_KEY).describe_index(PINECONE_INDEX_NAME).host
    return host


def get_embeddings():
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured.")
    return GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001",
        output_dimensionality=768,
        api_key=GEMINI_API_KEY,
    )


def create_vector_store(chunks):

    if not chunks:
        return None

    embeddings = get_embeddings()

    batch_size = 90
    vector_store = PineconeVectorStore(
        host=get_index_host(),
        embedding=embeddings,
        pinecone_api_key=PINECONE_API_KEY,
    )

    for i in range(0, len(chunks), batch_size):

        batch = chunks[i:i + batch_size]

        print(
            f"Processing chunks {i + 1} to {i + len(batch)}"
        )

        vector_store.add_documents(batch)

        print("Batch stored successfully!")

    return vector_store


def get_vector_store():

    if not PINECONE_INDEX_NAME:
        raise RuntimeError("PINECONE_INDEX_NAME is not configured.")

    embeddings = get_embeddings()

    vector_store = PineconeVectorStore(
        host=get_index_host(),
        embedding=embeddings,
        pinecone_api_key=PINECONE_API_KEY,
    )

    return vector_store
