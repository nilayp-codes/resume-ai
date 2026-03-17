"""
Photo upload route: accepts image files and saves them to uploads/ directory.
"""
import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, status

router = APIRouter(tags=["Upload"])

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads"))
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


@router.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):
    """
    Upload a profile photo for resume.
    Accepts jpg, jpeg, png files.
    Returns the URL path to the uploaded file.
    """
    # Validate file type
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No filename provided")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Ensure uploads directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Generate unique filename
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    # Save file
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    return {"photo_url": f"http://localhost:8000/uploads/{unique_name}"}
