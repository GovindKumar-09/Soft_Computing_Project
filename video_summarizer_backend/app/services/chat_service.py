from app.services.vector_store import get_vector_store
from app.services.retriever import create_retriever
from app.services.llm import get_llm
from app.utils.prompts import prompt


def chat_with_video(video_id, question):

    # Step 1: Connect to existing Pinecone index
    vector_store = get_vector_store()

    # Step 2: Create video-specific retriever
    retriever = create_retriever(
        vector_store,
        video_id
    )

    # Step 3: Retrieve relevant chunks
    retrieved_docs = retriever.invoke(question)

    if not retrieved_docs:
        return "I don't know. Relevant information was not found in this video."

    # Step 4: Create context
    context_text = "\n\n".join(
        doc.page_content for doc in retrieved_docs
    )

    # Step 5: Create prompt
    final_prompt = prompt.format(
        context=context_text,
        question=question
    )

    # Step 6: Generate answer
    llm = get_llm()

    response = llm.invoke(final_prompt)

    return response.content