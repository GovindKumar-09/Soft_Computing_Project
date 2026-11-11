
import json
import re
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate

from app.services.chains import create_text_chain


def parse_quiz_json(content):
    """Extract JSON from LLM response, stripping markdown fences."""
    if isinstance(content, list):
        content = "\n".join(
            item.get("text", "") if isinstance(item, dict) else str(item)
            for item in content
        )
    text = str(content).strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.IGNORECASE).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("[")
        end = text.rfind("]")
        if start != -1 and end != -1:
            return json.loads(text[start:end + 1])
        raise ValueError("AI did not return valid quiz JSON.")


def normalize_quiz(raw):
    """Ensure each question has the required shape."""
    questions = []
    for item in (raw if isinstance(raw, list) else []):
        if not isinstance(item, dict):
            continue
        q = str(item.get("question", "")).strip()
        if not q:
            continue
        options = item.get("options", [])
        if not isinstance(options, list) or len(options) != 4:
            continue
        options = [str(o).strip() for o in options]
        correct = item.get("correctAnswer", item.get("correct_answer", 0))
        try:
            correct = int(correct)
        except (TypeError, ValueError):
            # Try to find index by value
            answer_text = str(correct).strip().lower()
            matched = next(
                (i for i, o in enumerate(options) if o.lower() == answer_text),
                0
            )
            correct = matched
        correct = max(0, min(correct, len(options) - 1))
        explanation = str(item.get("explanation", "")).strip()
        questions.append({
            "question": q,
            "options": options,
            "correctAnswer": correct,
            "explanation": explanation
        })
    return questions


def generate_quiz(transcript: str, lecture_metadata: dict = None, num_questions: int = 10):
    """Generate MCQ quiz questions from a lecture transcript."""
    if not transcript or not transcript.strip():
        raise ValueError("Transcript cannot be empty.")

    meta = lecture_metadata or {}

    system_prompt = """
You are an expert quiz generator for university lectures.

Your task is to create multiple-choice quiz questions based on the lecture transcript.

RULES:
1. Base every question ONLY on the transcript content.
2. Each question must have exactly 4 options.
3. Only one option is correct.
4. correctAnswer is the zero-based index (0, 1, 2, or 3) of the correct option.
5. Add a brief explanation for each correct answer.
6. Questions must test real understanding, not trivial recall.
7. Vary question difficulty: include easy, medium and challenging questions.
8. Do NOT include timestamps in questions or answers.
9. Return ONLY valid JSON — an array of objects. No text before or after.

Use this exact structure:
[
  {
    "question": "Clear and specific question text.",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this answer is correct."
  }
]
"""

    human_prompt = f"""
Generate {num_questions} multiple-choice quiz questions from this lecture.

LECTURE TITLE: {meta.get("title", "Untitled Lecture")}
SUBJECT: {meta.get("subject", "General")}

TRANSCRIPT:
{transcript[:32000]}
"""

    quiz_prompt = ChatPromptTemplate.from_messages([
        SystemMessage(content=system_prompt),
        HumanMessage(content=human_prompt),
    ])
    quiz_chain = create_text_chain(quiz_prompt)
    raw = parse_quiz_json(quiz_chain.invoke({}))
    questions = normalize_quiz(raw)

    if not questions:
        raise ValueError("AI did not return any valid quiz questions.")

    return {
        "success": True,
        "questions": questions,
        "total": len(questions)
    }
