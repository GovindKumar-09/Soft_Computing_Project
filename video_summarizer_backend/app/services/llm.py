from langchain_groq import ChatGroq


def get_llm():

    llm = ChatGroq(
        model="openai/gpt-oss-120b",
        temperature=0.2
    )

    return llm



"""Get-ChildItem -Directory | Where-Object {
    $_.Name -notin @("venv", "node_modules", "__pycache__")
} | ForEach-Object {
    tree $_.FullName /F
}"""