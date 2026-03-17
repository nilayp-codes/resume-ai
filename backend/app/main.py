"""
FastAPI application entry point.
Configures CORS, middleware, routers, and database initialization.
"""
import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import engine
from app import models
from app.routes import auth, resume, pdf, ai, upload
import os
from dotenv import load_dotenv
from app.config import settings
from fastapi.staticfiles import StaticFiles

# Load .env first
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

# Resolve backend directory and uploads path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
print("Resolved upload directory:", UPLOAD_DIR)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup and validate critical keys."""
    logger.info("Starting Resume Generator API...")
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not configured")
    logger.info("Gemini API key loaded successfully")
    
    models.Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized.")
    logger.info(f"Uploads directory ready: {UPLOAD_DIR}")

    yield
    logger.info("Shutting down Resume Generator API.")


# FastAPI application instance
app = FastAPI(
    title="Resume Generator API",
    description="Production-ready REST API for AI-powered resume generation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    redirect_slashes=False,
)

# ─── CORS Middleware ──────────────────────────────────────────────────────────
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
_allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Mount uploads BEFORE routers ─────────────────────────────────────────────
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ─── Request Logging Middleware ───────────────────────────────────────────────
@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    logger.info(
        f"{request.method} {request.url.path} - {response.status_code} [{process_time:.1f}ms]"
    )
    return response


# ─── Global Exception Handler ────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again."}
    )


# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(pdf.router)
app.include_router(ai.router)
app.include_router(upload.router)


# ─── Health Check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "version": "1.0.0", "environment": settings.ENVIRONMENT}


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Resume Generator API",
        "docs": "/docs",
        "health": "/health",
    }
