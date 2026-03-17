"""
Photo upload route: uses Cloudinary in production, local filesystem in development.
"""
import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, status

router = APIRouter(tags=["Upload"])

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads"))
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def _get_cloudinary():
    """Initialize and return cloudinary module if configured."""
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET")

    if cloud_name and api_key and api_secret:
        import cloudinary
        import cloudinary.uploader
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret,
            secure=True
        )
        return cloudinary.uploader
    return None


@router.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):
    """
    Upload a profile photo for resume.
    Uses Cloudinary in production, local filesystem in development.
    """
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No filename provided")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    contents = await file.read()

    # Try Cloudinary first (production)
    uploader = _get_cloudinary()
    if uploader:
        try:
            result = uploader.upload(
                contents,
                folder="resume-ai/photos",
                public_id=uuid.uuid4().hex,
                resource_type="image",
                overwrite=True,
            )
            return {"photo_url": result["secure_url"]}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Cloudinary upload failed: {str(e)}"
            )

    # Fallback to local filesystem (development)
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    with open(file_path, "wb") as f:
        f.write(contents)

    api_base = os.getenv("API_BASE_URL", "http://localhost:8000")
    return {"photo_url": f"{api_base}/uploads/{unique_name}"}
