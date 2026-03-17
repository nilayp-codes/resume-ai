"""
Database configuration using SQLAlchemy with synchronous engine for simplicity.
Uses PostgreSQL via psycopg2.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

import logging
logger = logging.getLogger(__name__)

# Force SQLite for development to avoid environment variable overrides
db_url = settings.DATABASE_URL
if settings.ENVIRONMENT == "development" and not db_url.startswith("sqlite"):
    logger.warning(f"Overriding DATABASE_URL '{db_url}' with SQLite for development.")
    db_url = "sqlite:///./resume_gen.db"

logger.info(f"Connecting to database at: {db_url}")

# Handle SQLite vs Postgres engine arguments
connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency that provides a database session and ensures it's closed after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
