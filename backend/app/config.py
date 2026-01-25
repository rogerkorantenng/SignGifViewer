from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # API Keys
    gemini_api_key: str = ""

    # CORS
    cors_origins: list[str] = [
        "http://localhost:3000",
        "https://db5ht1h3t7t67.cloudfront.net",
        "http://signbridge-frontend-env.eba-zmusnsbs.us-east-1.elasticbeanstalk.com",
    ]

    # App Settings
    debug: bool = True
    app_name: str = "SignBridge API"
    app_version: str = "1.0.0"

    # Gemini Settings
    gemini_model: str = "gemini-3-flash-preview"  # Using Gemini 3 for the hackathon
    gemini_vision_model: str = "gemini-3-pro-image-preview"  # For image analysis

    # Processing Settings
    max_frame_size: int = 1280
    frame_quality: int = 85

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
