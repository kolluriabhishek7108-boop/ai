from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Advanced Multi-Agent Generator"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "agent_generator")
    
    # API
    API_PREFIX: str = "/api"
    
    # CORS
    CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "*").split(",")
    
    # LLM Integration
    EMERGENT_LLM_KEY: str = os.getenv("EMERGENT_LLM_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Agent Configuration
    MAX_AGENTS: int = 12
    AGENT_TIMEOUT: int = 300  # seconds
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
