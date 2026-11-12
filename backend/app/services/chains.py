"""Shared LangChain Expression Language (LCEL) chain builders."""

from langchain_core.output_parsers import StrOutputParser

from app.services.llm import get_llm


def create_text_chain(prompt):
    """Compose a prompt, chat model, and text parser into an LCEL chain."""
    return prompt | get_llm() | StrOutputParser()
