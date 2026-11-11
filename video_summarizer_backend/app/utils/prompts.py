from langchain_core.prompts import PromptTemplate


prompt = PromptTemplate(
    template="""
You are a helpful video assistant.

Answer ONLY using the provided video transcript context.

If the answer is not available in the context,
clearly say that you don't know.

Do not make up information.

Context:
{context}

Question:
{question}

Answer:
""",
    input_variables=["context", "question"]
)