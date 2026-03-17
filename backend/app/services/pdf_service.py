"""
PDF generation service using Playwright (headless Chromium).

Runs Playwright in a separate subprocess using blocking subprocess.run().
The FastAPI route calls this synchronously — no async event loop involvement.

Key features:
- Sets viewport to 794x1123 to match A4 exactly
- Uses pixel dimensions (not "A4" format) to prevent scaling
- Adds 500ms timeout after networkidle to ensure images load
- Frontend sends a full HTML document with fonts already embedded
"""
import subprocess
import sys
import tempfile
import os
import logging
import traceback

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

    # Extra wait to ensure fonts fully load
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
    """
    Generate PDF by running Playwright in a separate subprocess.
    This is a BLOCKING call — the route runs it in FastAPI's thread pool.

    The frontend sends a complete HTML document with fonts and styles
    already embedded, so no server-side wrapping is needed.
    """
    html_path = None
    pdf_path = None
    script_path = None
    try:
        # Write HTML directly to temp file (frontend sends full document)
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".html", delete=False, encoding="utf-8"
        ) as f:
            f.write(html_content)
            html_path = f.name

        pdf_path = html_path.replace(".html", ".pdf")

        # Write the Playwright script to a temp file (avoids shell escaping)
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".py", delete=False, encoding="utf-8"
        ) as f:
            f.write(_PLAYWRIGHT_SCRIPT_TEMPLATE)
            script_path = f.name

        result = subprocess.run(
            [_PYTHON, script_path, html_path, pdf_path],
            capture_output=True,
            text=True,
            timeout=60,
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
        print("PDF GENERATION ERROR:")
        traceback.print_exc()
        raise

    finally:
        for path in (html_path, pdf_path, script_path):
            if path and os.path.exists(path):
                try:
                    os.unlink(path)
                except OSError:
                    pass
