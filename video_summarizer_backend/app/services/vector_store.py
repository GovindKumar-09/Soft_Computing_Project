import os
import time

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore


def get_embeddings():

    embeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001",
        output_dimensionality=768
    )

    return embeddings


def create_vector_store(chunks):

    embeddings = get_embeddings()

    index_name = os.getenv("PINECONE_INDEX_NAME")

    batch_size = 90
    vector_store = None

    for i in range(0, len(chunks), batch_size):

        batch = chunks[i:i + batch_size]

        print(
            f"Processing chunks {i + 1} to {i + len(batch)}"
        )

        vector_store = PineconeVectorStore.from_documents(
            documents=batch,
            embedding=embeddings,
            index_name=index_name
        )

        print("Batch stored successfully!")

        if i + batch_size < len(chunks):

            print("Waiting 60 seconds...")
            time.sleep(60)

    return vector_store


def get_vector_store():

    embeddings = get_embeddings()

    vector_store = PineconeVectorStore(
        index_name=os.getenv("PINECONE_INDEX_NAME"),
        embedding=embeddings
    )

    return vector_store