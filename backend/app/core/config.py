from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Advanced Multi-Agent Generator"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    MONGO_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "agent_generator"
    
    # API
    API_PREFIX: str = "/api"
    
    # CORS
    CORS_ORIGINS: str = "*"
    
    # LLM Integration
    EMERGENT_LLM_KEY: str = ""
    GEMINI_API_KEY: str = ""
    
    # Agent Configuration
    MAX_AGENTS: int = 12
    AGENT_TIMEOUT: int = 300  # seconds
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def cors_origins_list(self) -> List[str]:
        return self.CORS_ORIGINS.split(",") if self.CORS_ORIGINS else ["*"]

settings = Settings()
