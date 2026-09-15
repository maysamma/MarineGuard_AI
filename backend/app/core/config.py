from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

class Settings(BaseSettings):
    app_name: str = "MarineGuard AI"
    database_url: str = "sqlite:///./marineguard.db"
    upload_dir: str = "./data/uploads"
    max_image_mb: int = 10
    ai_provider: str = "gemini"
    ai_model: str = "gemini-2.5-flash"
    gemini_api_key: str = ""
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "qwen2.5vl:7b"
    cors_origins: str = "http://localhost:5173"
    reviewer_token: str = ""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
