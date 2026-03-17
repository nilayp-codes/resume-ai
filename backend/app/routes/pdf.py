"""
PDF generation route: accepts resume HTML from the frontend
and returns a downloadable PDF generated via Playwright.
"""
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io
import logging

from app.services.pdf_service import generate_resume_pdf_sync

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/pdf", tags=["PDF Generation"])


class ResumeHTML(BaseModel):
    html: str


@router.post("/generate")
def generate_pdf(data: ResumeHTML):
    """
    Accept raw HTML from the frontend resume preview,
    render it in headless Chromium via subprocess, and return a PDF.

    This is a sync endpoint — subprocess.run() blocks but runs in
    FastAPI's default thread pool, keeping the event loop free.
    """
    if not data.html or len(data.html.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="HTML content is required",
        )

    try:
        pdf_bytes = generate_resume_pdf_sync(data.html)
    except Exception as e:
        logger.error(f"PDF generation failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF generation failed: {repr(e)}",
        )

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'attachment; filename="resume.pdf"'
        },
    )
