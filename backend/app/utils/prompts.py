# Re-export prompt so both "prompt.py" and "prompts.py" import paths work.
# chat_service.py uses: from app.utils.prompts import prompt
from app.utils.prompt import prompt

__all__ = ["prompt"]
