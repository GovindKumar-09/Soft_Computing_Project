from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound
)

from urllib.parse import urlparse, parse_qs
import re


def extract_video_id(url):

    parsed_url = urlparse(url)

    if parsed_url.hostname in ["youtu.be", "www.youtu.be"]:
        return parsed_url.path.lstrip("/").split("/")[0]

    video_id = parse_qs(parsed_url.query).get("v")

    if video_id:
        return video_id[0]

    match = re.search(
        r"/(shorts|embed|live)/([^/?]+)",
        parsed_url.path
    )

    if match:
        return match.group(2)

    raise ValueError("Invalid YouTube URL")


def get_transcript(url):

    video_id = extract_video_id(url)

    try:
        transcript_list = YouTubeTranscriptApi().list(video_id)

        selected_transcript = transcript_list.find_transcript(["en"])

        fetched_transcript = selected_transcript.fetch()

        transcript = " ".join(
            chunk.text for chunk in fetched_transcript
        )

        return transcript

    except TranscriptsDisabled:
        print("Captions are disabled for this video.")

    except NoTranscriptFound:
        print("English transcript is not available.")

    except Exception as e:
        print(f"Transcript Error: {e}")

    return None