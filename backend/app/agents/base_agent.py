from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.core.llm_client import LLMClient
import logging

logger = logging.getLogger(__name__)

class BaseAgent(ABC):
    """Base class for all specialized agents"""
    
    def __init__(self, name: str, llm_provider: str = "emergent"):
        self.name = name
        self.llm_client = LLMClient(provider=llm_provider)
        self.logger = logging.getLogger(f"agent.{name}")
    
    @abstractmethod
    def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the agent's task"""
        pass
    
    def generate_code(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Generate code using LLM"""
        full_prompt = self._build_prompt(prompt, context)
        return self.llm_client.generate(full_prompt, temperature=0.2, max_tokens=3000)
    
    def _build_prompt(self, prompt: str, context: Optional[Dict[str, Any]]) -> str:
        """Build a comprehensive prompt with context"""
        if not context:
            return prompt
        
        context_str = "\n".join([f"{k}: {v}" for k, v in context.items()])
        return f"""Context:
{context_str}

Task:
{prompt}

Provide a complete, production-ready implementation."""
    
    def log(self, message: str, level: str = "info"):
        """Log agent activity"""
        log_method = getattr(self.logger, level, self.logger.info)
        log_method(f"[{self.name}] {message}")
