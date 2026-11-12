from functools import lru_cache

from langchain_groq import ChatGroq
from app.core.config import GROQ_CHAT_MODEL


@lru_cache(maxsize=1)
def get_llm():
    return ChatGroq(model=GROQ_CHAT_MODEL, temperature=0.2)



"""Get-ChildItem -Directory | Where-Object {
    $_.Name -notin @("venv", "node_modules", "__pycache__")
} | ForEach-Object {
    tree $_.FullName /F
}"""
