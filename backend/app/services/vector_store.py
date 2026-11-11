import os

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone


_index_host = None


def get_index_host():
    """Resolve the data-plane host once, avoiding a lookup per vector store."""
    global _index_host
    if _index_host:
        return _index_host

    host = os.getenv("PINECONE_HOST")
    if not host:
        index_name = os.getenv("PINECONE_INDEX_NAME")
        api_key = os.getenv("PINECONE_API_KEY")
        if not index_name or not api_key:
            raise RuntimeError("Pinecone index name and API key must be configured.")
        host = Pinecone(api_key=api_key).describe_index(index_name).host

    _index_host = host
    return host


def get_embeddings():

    embeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001",
        output_dimensionality=768
    )

    return embeddings


def create_vector_store(chunks):

    if not chunks:
        return None

    embeddings = get_embeddings()

    batch_size = 90
    vector_store = PineconeVectorStore(
        host=get_index_host(),
        embedding=embeddings,
        pinecone_api_key=os.getenv("PINECONE_API_KEY")
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

    index_name = os.getenv("PINECONE_INDEX_NAME")
    if not index_name:
        raise RuntimeError("PINECONE_INDEX_NAME is not configured.")

    embeddings = get_embeddings()

    vector_store = PineconeVectorStore(
        host=get_index_host(),
        embedding=embeddings
    )

    return vector_store
