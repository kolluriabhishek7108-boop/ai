from app.agents.base_agent import BaseAgent
from typing import Dict, Any

class APIArchitectAgent(BaseAgent):
    """Agent specialized in designing RESTful APIs and API contracts"""
    
    def __init__(self, llm_provider: str = "emergent"):
        super().__init__("API_Architect", llm_provider)
    
    def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Design comprehensive API architecture"""
        self.log("Starting API architecture design")
        
        requirements = task.get("requirements", "")
        app_type = task.get("app_type", "web")
        architecture = task.get("architecture", "rest")
        
        prompt = f"""Design a comprehensive API architecture for the following application:

Requirements: {requirements}
App Type: {app_type}
Architecture: {architecture}

Provide:
1. Complete REST API endpoint specifications (routes, methods, request/response)
2. Authentication & authorization strategy (JWT, OAuth2, etc.)
3. API versioning strategy
4. Rate limiting and throttling
5. Error handling patterns
6. API documentation structure (OpenAPI/Swagger)
7. Request validation schemas
8. Response formats and status codes
9. Pagination, filtering, and sorting strategies
10. WebSocket/real-time endpoints (if needed)

Format as a detailed API specification document."""
        
        api_design = self.generate_code(prompt, {
            "app_type": app_type,
            "architecture": architecture
        })
        
        self.log("API architecture design completed")
        
        return {
            "agent": self.name,
            "status": "completed",
            "api_specification": api_design,
            "endpoints_count": self._count_endpoints(api_design),
            "features": [
                "RESTful API Design",
                "Authentication Strategy",
                "Rate Limiting",
                "API Versioning",
                "Error Handling",
                "OpenAPI Documentation"
            ]
        }
    
    def _count_endpoints(self, design: str) -> int:
        """Count API endpoints in the design"""
        # Simple heuristic: count common HTTP methods
        methods = ["GET", "POST", "PUT", "PATCH", "DELETE"]
        count = sum(design.count(method) for method in methods)
        return count