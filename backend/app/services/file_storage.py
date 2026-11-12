"""Streaming helpers for incoming lecture files."""

from fastapi import HTTPException, UploadFile


async def save_upload(file: UploadFile, destination, max_size: int) -> int:
    total_size = 0
    try:
        with destination.open("wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                total_size += len(chunk)
                if total_size > max_size:
                    raise HTTPException(
                        status_code=413,
                        detail="Uploaded file exceeds the size limit."
                    )
                buffer.write(chunk)

        if total_size == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        return total_size
    except Exception:
        destination.unlink(missing_ok=True)
        raise
