"""
PDF generation service.
Uses Browserless.io API in production, falls back to local Playwright in development.
"""
import subprocess
import sys
import tempfile
import os
import logging
import traceback
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

_PYTHON = sys.executable

_PLAYWRIGHT_SCRIPT_TEMPLATE = '''
import sys
from playwright.sync_api import sync_playwright

html_path = sys.argv[1]
pdf_path = sys.argv[2]

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

with sync_playwright() as p:
    browser = p.chromium.launch(args=["--no-sandbox"])
    page = browser.new_page()
    page.set_viewport_size({"width": 794, "height": 1123})
    page.set_content(html)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(500)
    page.pdf(
        path=pdf_path,
        format="A4",
        print_background=True,
        margin={"top": "0px", "right": "0px", "bottom": "0px", "left": "0px"},
    )
    browser.close()
print("PDF_OK")
'''


def generate_resume_pdf_sync(html_content: str) -> bytes:
    """Generate PDF using Browserless API in production, local Playwright in development."""

    browserless_token = getattr(settings, 'BROWSERLESS_API_KEY', None) or os.getenv('BROWSERLESS_API_KEY')

    if browserless_token:
        return _generate_with_browserless(html_content, browserless_token)
    else:
        logger.info("No BROWSERLESS_API_KEY found, using local Playwright")
        return _generate_with_playwright(html_content)


def _generate_with_browserless(html_content: str, token: str) -> bytes:
    """Generate PDF using Browserless.io cloud API."""
    logger.info("Generating PDF via Browserless.io")

    url = f"https://production-sfo.browserless.io/pdf?token={token}"

    payload = {
        "html": html_content,
        "options": {
            "format": "A4",
            "printBackground": True,
            "margin": {
                "top": "0px",
                "right": "0px",
                "bottom": "0px",
                "left": "0px"
            }
        },
        "gotoOptions": {
            "waitUntil": "networkidle2",
            "timeout": 30000
        }
    }

    with httpx.Client(timeout=60.0) as client:
        response = client.post(
            url,
            json=payload,
            headers={"Content-Type": "application/json"}
        )

    if response.status_code != 200:
        logger.error(f"Browserless API error: {response.status_code} - {response.text[:500]}")
        raise RuntimeError(f"Browserless API failed with status {response.status_code}")

    pdf_bytes = response.content
    logger.info(f"Generated PDF via Browserless: {len(pdf_bytes)} bytes")
    return pdf_bytes


def _generate_with_playwright(html_content: str) -> bytes:
    """Generate PDF using local Playwright (development fallback)."""
    html_path = None
    pdf_path = None
    script_path = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".html", delete=False, encoding="utf-8") as f:
            f.write(html_content)
            html_path = f.name

        pdf_path = html_path.replace(".html", ".pdf")

        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as f:
            f.write(_PLAYWRIGHT_SCRIPT_TEMPLATE)
            script_path = f.name

        result = subprocess.run(
            [_PYTHON, script_path, html_path, pdf_path],
            capture_output=True, text=True, timeout=60,
        )

        if result.returncode != 0:
            error_msg = result.stderr.strip()
            logger.error(f"Playwright subprocess failed:\n{error_msg}")
            raise RuntimeError(f"Playwright failed: {error_msg[-500:]}")

        if not os.path.exists(pdf_path):
            raise RuntimeError("PDF file was not created")

        with open(pdf_path, "rb") as f:
            pdf_bytes = f.read()

        logger.info(f"Generated PDF: {len(pdf_bytes)} bytes")
        return pdf_bytes

    except Exception as e:
        traceback.print_exc()
        raise
    finally:
        for path in (html_path, pdf_path, script_path):
            if path and os.path.exists(path):
                try:
                    os.unlink(path)
                except OSError:
                    pass
