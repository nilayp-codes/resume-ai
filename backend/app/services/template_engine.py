"""
Template engine service: renders Jinja2 HTML templates with resume data.
"""
import os
from typing import Any, Dict
from jinja2 import Environment, FileSystemLoader, select_autoescape
import bleach

# Templates directory path
TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")

# Jinja2 environment
jinja_env = Environment(
    loader=FileSystemLoader(TEMPLATES_DIR),
    autoescape=select_autoescape(["html", "xml"]),
)

# Color theme CSS variables
COLOR_THEMES = {
    "blue": {
        "primary": "#1e40af",
        "primary_light": "#3b82f6",
        "accent": "#60a5fa",
        "sidebar_bg": "#1e3a8a",
    },
    "gray": {
        "primary": "#374151",
        "primary_light": "#6b7280",
        "accent": "#9ca3af",
        "sidebar_bg": "#1f2937",
    },
    "black": {
        "primary": "#111827",
        "primary_light": "#374151",
        "accent": "#6b7280",
        "sidebar_bg": "#000000",
    },
    "green": {
        "primary": "#065f46",
        "primary_light": "#10b981",
        "accent": "#34d399",
        "sidebar_bg": "#064e3b",
    },
    "purple": {
        "primary": "#4c1d95",
        "primary_light": "#7c3aed",
        "accent": "#a78bfa",
        "sidebar_bg": "#3b0764",
    },
}

# Font families
FONT_MAP = {
    "inter": "Inter, sans-serif",
    "georgia": "Georgia, serif",
    "roboto": "Roboto, sans-serif",
    "merriweather": "Merriweather, serif",
    "opensans": "Open Sans, sans-serif",
}

VALID_TEMPLATES = {"modern", "executive", "classic", "minimal"}


def sanitize_text(value: str) -> str:
    """Strip all HTML tags from a string to prevent XSS in PDFs."""
    return bleach.clean(value, tags=[], strip=True)


def sanitize_data(data: Any) -> Any:
    """Recursively sanitize all string values in a nested dict/list."""
    if isinstance(data, str):
        return sanitize_text(data)
    if isinstance(data, dict):
        return {k: sanitize_data(v) for k, v in data.items()}
    if isinstance(data, list):
        return [sanitize_data(item) for item in data]
    return data


def render_resume_template(
    template_name: str,
    resume_data: Dict[str, Any],
    color_theme: str = "blue",
    font_family: str = "inter",
) -> str:
    """
    Render a Jinja2 HTML template with resume data.

    Args:
        template_name: one of 'modern', 'sidebar', 'executive'
        resume_data: dict matching the ResumeData schema
        color_theme: key from COLOR_THEMES
        font_family: key from FONT_MAP

    Returns:
        Rendered HTML string ready for PDF conversion.
    """
    if template_name not in VALID_TEMPLATES:
        template_name = "modern"

    theme = COLOR_THEMES.get(color_theme, COLOR_THEMES["blue"])
    font = FONT_MAP.get(font_family, FONT_MAP["inter"])

    # Sanitize all text data before injecting into HTML
    safe_data = sanitize_data(resume_data)

    template = jinja_env.get_template(f"{template_name}.html")
    return template.render(
        data=safe_data,
        theme=theme,
        font_family=font,
    )
