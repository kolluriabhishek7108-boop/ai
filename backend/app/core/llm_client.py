import os
import asyncio
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import Emergent LLM integration
from emergentintegrations.llm.chat import LlmChat, UserMessage

class LLMClient:
    """Unified LLM client using Emergent LLM Key"""
    
    def __init__(self, provider: str = "openai", model: str = "gpt-4o-mini"):
        self.provider = provider
        self.model = model
        self.emergent_key = os.environ.get("EMERGENT_LLM_KEY", "")
        self.gemini_key = os.environ.get("GEMINI_API_KEY", "")
        
    async def generate_async(self, prompt: str, system_message: str = "You are a helpful AI assistant.", session_id: str = "default") -> str:
        """Generate text using Emergent LLM integration (async)"""
        try:
            chat = LlmChat(
                api_key=self.emergent_key,
                session_id=session_id,
                system_message=system_message
            )
            
            # Set the model and provider
            chat.with_model(self.provider, self.model)
            
            # Create user message
            user_message = UserMessage(text=prompt)
            
            # Send message and get response
            response = await chat.send_message(user_message)
            return response
        except Exception as e:
            return f"Error generating with Emergent LLM: {str(e)}"
    
    def generate(self, prompt: str, model: str = None, temperature: float = 0.7, max_tokens: int = 2000) -> str:
        """Generate text synchronously (wrapper for async)"""
        try:
            # Run async method in event loop
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(self.generate_async(prompt))
            loop.close()
            return result
        except Exception as e:
            # Fallback to Gemini if emergent fails
            if self.gemini_key:
                return self._generate_gemini(prompt, temperature, max_tokens)
            return f"Error: {str(e)}"
    
    def _generate_gemini(self, prompt: str, temperature: float, max_tokens: int) -> str:
        """Generate using Gemini API directly as fallback"""
        import requests
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

Be specific and practical. Return ONLY valid JSON."""
        
        response = self.generate(prompt)
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
