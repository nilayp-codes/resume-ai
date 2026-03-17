"""
Pydantic settings for configuration management.
Reads from environment variables and .env file.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Use SQLite by default for easier local development
    DATABASE_URL: str = "sqlite:///./resume_gen.db"
    SECRET_KEY: str  # No default — must be set in environment
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    GEMINI_API_KEY: str  # No default — must be set in environment
    ENVIRONMENT: str = "production"

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
