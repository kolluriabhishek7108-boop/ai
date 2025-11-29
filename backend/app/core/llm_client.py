import os
from typing import Dict, Any, Optional, List
import requests
from app.core.config import settings

class LLMClient:
    """Unified LLM client supporting Emergent LLM Key and Gemini API"""
    
    def __init__(self, provider: str = "emergent"):
        self.provider = provider
        self.emergent_key = settings.EMERGENT_LLM_KEY
        self.gemini_key = settings.GEMINI_API_KEY
        
    def generate(self, prompt: str, model: str = "gpt-4o", temperature: float = 0.7, max_tokens: int = 2000) -> str:
        """Generate text using the configured LLM provider"""
        if self.provider == "emergent":
            return self._generate_emergent(prompt, model, temperature, max_tokens)
        elif self.provider == "gemini":
            return self._generate_gemini(prompt, temperature, max_tokens)
        else:
            raise ValueError(f"Unknown provider: {self.provider}")
    
    def _generate_emergent(self, prompt: str, model: str, temperature: float, max_tokens: int) -> str:
        """Generate using Emergent LLM Key (OpenAI/Anthropic/Google)"""
        # Using OpenAI-compatible endpoint
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.emergent_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=60)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Error generating with Emergent LLM: {str(e)}"
    
    def _generate_gemini(self, prompt: str, temperature: float, max_tokens: int) -> str:
        """Generate using Gemini API directly"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={self.gemini_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens
            }
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=60)
            response.raise_for_status()
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            return f"Error generating with Gemini: {str(e)}"
    
    def analyze_requirements(self, user_input: str) -> Dict[str, Any]:
        """Analyze user requirements and extract structured information"""
        prompt = f"""Analyze the following application requirements and extract structured information.

User Input: {user_input}

Provide a JSON response with:
- app_type: (web/mobile/desktop)
- features: list of main features
- tech_stack: suggested technologies
- complexity: (simple/moderate/complex)
- architecture: suggested architecture pattern
- estimated_time: development time estimate

Be specific and practical."""
        
        response = self.generate(prompt, temperature=0.3)
        # Parse JSON from response
        try:
            import json
            # Extract JSON if wrapped in markdown code blocks
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0].strip()
            elif "```" in response:
                response = response.split("```")[1].split("```")[0].strip()
            return json.loads(response)
        except:
            return {"raw_response": response, "error": "Failed to parse structured response"}
