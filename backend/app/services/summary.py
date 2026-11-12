
import json
import re
from datetime import datetime, timezone

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate

from app.core.database import get_summary_collection
from app.services.chains import create_text_chain


def get_collection():
    return get_summary_collection()


def extract_response_text(content):
    """Handle string and block-based LLM responses."""

    if isinstance(content, str):
        return content

    if isinstance(content, list):
        parts = []

        for item in content:
            if isinstance(item, dict):
                parts.append(item.get("text", ""))
            else:
                parts.append(str(item))

        return "\n".join(parts)

    return str(content)


def parse_summary_json(content):
    """Extract JSON even if the model adds Markdown fences."""

    text = extract_response_text(content).strip()

    text = re.sub(
        r"^```(?:json)?\s*|\s*```$",
        "",
        text,
        flags=re.IGNORECASE
    ).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")

        if start == -1 or end == -1:
            raise ValueError("AI did not return valid JSON.")

        return json.loads(text[start:end + 1])


def normalize_summary(data):
    """Ensure all fields have predictable types."""

    def safe_list(value):
        return value if isinstance(value, list) else []

    def safe_string(value):
        return str(value).strip() if value is not None else ""

    concepts = []

    for item in safe_list(data.get("important_concepts")):
        if isinstance(item, dict):
            concept = safe_string(item.get("concept"))
            explanation = safe_string(item.get("explanation"))

            if concept and explanation:
                concepts.append({
                    "concept": concept,
                    "explanation": explanation
                })

    examples = []

    for item in safe_list(data.get("notable_examples")):
        if isinstance(item, dict):
            name = safe_string(item.get("name"))
            description = safe_string(item.get("description"))

            if name:
                examples.append({
                    "name": name,
                    "description": description
                })

    questions = []

    for item in safe_list(data.get("revision_questions")):
        if isinstance(item, dict):
            question = safe_string(item.get("question"))
            answer = safe_string(item.get("answer"))

            if question:
                questions.append({
                    "question": question,
                    "answer": answer
                })

    return {
        "main_topic": safe_string(data.get("main_topic")),
        "overview": safe_string(data.get("overview")),
        "important_concepts": concepts,
        "key_points": [
            safe_string(point)
            for point in safe_list(data.get("key_points"))
            if safe_string(point)
        ],
        "notable_examples": examples,
        "revision_questions": questions,
        "bottom_line": safe_string(data.get("bottom_line"))
    }


def generate_summary(
    transcript: str,
    video_id: str,
    username: str = "anonymous",
    lecture_metadata: dict = None
):
    if not transcript or not transcript.strip():
        raise ValueError("Transcript cannot be empty.")

    system_prompt = """
You are an expert university lecture summarizer and study-note creator.

Your task is to convert a lecture transcript into high-quality,
well-structured study notes.

IMPORTANT RULES:

1. Understand the entire transcript before writing.
2. Preserve important technical terms, definitions, names and examples.
3. Explain difficult ideas in simple but accurate language.
4. Do not repeat the same information in multiple sections.
5. Never invent facts, dates, examples or explanations.
6. Include examples only when supported by the transcript.
7. Keep explanations informative rather than overly short.
8. Organize the notes logically for a university student preparing
   for examinations.
9. Do not include timestamps.
10. Return ONLY valid JSON. Do not add Markdown fences or text outside JSON.

Use this exact JSON structure:

{
  "main_topic": "One clear sentence describing the central topic.",
  "overview": "A meaningful introductory overview of the lecture.",
  "important_concepts": [
    {
      "concept": "Concept name",
      "explanation": "Clear and sufficiently detailed explanation."
    }
  ],
  "key_points": [
    "Important takeaway with useful detail."
  ],
  "notable_examples": [
    {
      "name": "Example or historical reference",
      "description": "Why it matters and what it demonstrates."
    }
  ],
  "revision_questions": [
    {
      "question": "A useful question for revision.",
      "answer": "A concise answer based on the lecture."
    }
  ],
  "bottom_line": "A short concluding paragraph connecting the main ideas."
}

CONTENT GUIDELINES:

- Main topic: exactly one central topic.
- Overview: approximately 2-4 informative sentences.
- Important concepts: include the major concepts, with explanations.
- Key points: provide approximately 5-10 meaningful takeaways when
  the lecture contains enough information.
- Notable examples: include relevant examples, case studies,
  historical events or applications. Use an empty array if none exist.
- Revision questions: create approximately 3-5 useful questions
  with answers, based only on the transcript.
- Bottom line: summarize the central lesson in a few sentences.

Adapt the number of entries to the actual lecture. Never invent
content just to fill a target number.
"""

    human_prompt = f"""
Create structured study notes from this lecture.

LECTURE TITLE:
{(lecture_metadata or {}).get("title", "Untitled Lecture")}

SUBJECT:
{(lecture_metadata or {}).get("subject", "General")}

TRANSCRIPT:
{transcript}
"""

    summary_prompt = ChatPromptTemplate.from_messages([
        SystemMessage(content=system_prompt),
        HumanMessage(content=human_prompt),
    ])
    summary_chain = create_text_chain(summary_prompt)
    raw_data = parse_summary_json(summary_chain.invoke({}))

    structured_summary = normalize_summary(raw_data)

    if not structured_summary["main_topic"]:
        raise ValueError("AI summary is missing the main topic.")

    if not structured_summary["overview"]:
        raise ValueError("AI summary is missing the overview.")

    now = datetime.now(timezone.utc)

    metadata = lecture_metadata or {}

    document = {
        "video_id": video_id,
        "username": username,
        "transcript": transcript,

        # Short overview used for previews and summary cards
        "summary": structured_summary["overview"],

        # Complete structured study notes
        "summary_data": structured_summary,

        "status": "completed",
        "summary_status": "completed",
        "updated_at": now
    }

    for field in [
        "title",
        "subject",
        "original_name",
        "video_stored_name"
    ]:
        if metadata.get(field) is not None:
            document[field] = metadata[field]

    collection = get_collection()

    collection.update_one(
        {"video_id": video_id},
        {
            "$set": document,
            "$setOnInsert": {
                "created_at": now
            }
        },
        upsert=True
    )

    return {
        "success": True,
        "video_id": video_id,
        "username": username,
        "summary": structured_summary["overview"],
        "summary_data": structured_summary
    }
