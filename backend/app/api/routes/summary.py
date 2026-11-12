
from fastapi import APIRouter, HTTPException, Depends

from app.core.database import get_summary_collection
from app.core.auth import get_current_user


router = APIRouter()


# --------------------------------------------------
# DATABASE HELPER
# --------------------------------------------------

def get_collection():
    try:
        return get_summary_collection()
    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail="MongoDB summary collection is unavailable."
        ) from error


# --------------------------------------------------
# SERIALIZE LECTURE
# --------------------------------------------------

def serialize_lecture(document, include_transcript=False):

    created_at = (
        document.get("created_at")
        or document.get("updated_at")
    )

    summary_data = document.get("summary_data", {}) or {}

    summary = document.get("summary", "")

    lecture = {
        "id": document.get("video_id"),
        "lectureId": document.get("video_id"),
        "title": document.get("title", "Untitled Lecture"),
        "subject": document.get("subject", "General"),
        "originalName": document.get("original_name", ""),
        "summary": summary,
        "summaryPreview": summary[:220],
        "summaryData": summary_data,
        "status": document.get("status", "uploaded"),
        "summaryStatus": document.get(
            "summary_status",
            "pending"
        ),
        "createdAt": created_at
    }

    if include_transcript:
        lecture["transcript"] = document.get("transcript", "")

    return lecture


# --------------------------------------------------
# GET ALL LECTURES - MY LECTURES
# --------------------------------------------------

@router.get("/lectures")
def get_lectures(current_user=Depends(get_current_user)):

    collection = get_collection()

    try:
        documents = list(
            collection.find(
                {"username": current_user["email"]}
            ).sort("created_at", -1)
        )

        return {
            "success": True,
            "total": len(documents),
            "lectures": [
                serialize_lecture(document)
                for document in documents
            ]
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Could not fetch lectures. Please retry."
        )


# --------------------------------------------------
# GET ONE LECTURE
# --------------------------------------------------

@router.get("/lectures/{lecture_id}")
def get_lecture(lecture_id: str, current_user=Depends(get_current_user)):

    collection = get_collection()

    try:
        document = collection.find_one({
            "video_id": lecture_id,
            "username": current_user["email"]
        })

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Lecture not found."
            )

        return {
            "success": True,
            "lecture": serialize_lecture(
                document,
                include_transcript=True
            )
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Could not fetch lecture. Please retry."
        )


# --------------------------------------------------
# GET GENERATED SUMMARY - NOTES PAGE
# --------------------------------------------------

@router.get("/lectures/{lecture_id}/summary")
def get_lecture_summary(lecture_id: str, current_user=Depends(get_current_user)):

    collection = get_collection()

    try:
        document = collection.find_one({
            "video_id": lecture_id,
            "username": current_user["email"]
        })

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Lecture not found."
            )

        summary = document.get("summary", "")

        summary_data = document.get(
            "summary_data",
            {}
        ) or {}

        if not summary and not summary_data:
            raise HTTPException(
                status_code=404,
                detail="Summary has not been generated yet."
            )

        return {
            "success": True,
            "lectureId": lecture_id,
            "title": document.get("title", "Untitled Lecture"),
            "subject": document.get("subject", "General"),
            "summary": summary,
            "summaryData": summary_data
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Could not fetch summary. Please retry."
        )
