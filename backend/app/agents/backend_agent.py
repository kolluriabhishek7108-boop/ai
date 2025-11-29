from typing import Dict, Any
from app.agents.base_agent import BaseAgent

class BackendAgent(BaseAgent):
    """Specialized agent for backend development"""
    
    def __init__(self, llm_provider: str = "emergent"):
        super().__init__("BackendAgent", llm_provider)
        self.expertise = "Backend architecture, API design, database modeling, business logic"
    
    def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute backend development task"""
        self.log("Starting backend development task")
        
        project_type = task.get("project_type", "web")
        requirements = task.get("requirements", "")
        architecture = task.get("architecture", "modular")
        
        # Generate backend structure
        backend_structure = self._generate_structure(project_type, architecture)
        
        # Generate API endpoints
        api_code = self._generate_api_endpoints(requirements)
        
        # Generate models
        models_code = self._generate_models(requirements)
        
        # Generate services
        services_code = self._generate_services(requirements)
        
        return {
            "status": "success",
            "structure": backend_structure,
            "api_code": api_code,
            "models_code": models_code,
            "services_code": services_code,
            "message": "Backend architecture generated successfully"
        }
    
    def _generate_structure(self, project_type: str, architecture: str) -> Dict[str, Any]:
        """Generate backend folder structure"""
        if architecture == "modular":
            return {
                "app/": {
                    "__init__.py": "",
                    "main.py": "# Main application entry",
                    "core/": {"config.py": "", "security.py": "", "dependencies.py": ""},
                    "api/": {"__init__.py": "", "v1/": {"endpoints/": {}}},
                    "models/": {"__init__.py": ""},
                    "services/": {"__init__.py": ""},
                    "utils/": {"__init__.py": ""},
                    "db/": {"__init__.py": "", "database.py": ""}
                },
                "requirements.txt": "",
                "README.md": ""
            }
        return {}
    
    def _generate_api_endpoints(self, requirements: str) -> str:
        """Generate API endpoints based on requirements"""
        prompt = f"""Generate FastAPI endpoint code for the following requirements:

{requirements}

Create RESTful API endpoints with:
- Proper error handling
- Input validation using Pydantic
- Async/await patterns
- Clear documentation
- Status codes

Provide complete, production-ready code."""
        
        return self.generate_code(prompt)
    
    def _generate_models(self, requirements: str) -> str:
        """Generate database models"""
        prompt = f"""Generate Pydantic models for MongoDB based on:

{requirements}

Include:
- Proper field types
- Validation rules
- Relationships between models
- UUID for IDs (not ObjectId)
- Timestamps

Provide complete model definitions."""
        
        return self.generate_code(prompt)
    
    def _generate_services(self, requirements: str) -> str:
        """Generate business logic services"""
        prompt = f"""Generate service layer code for:

{requirements}

Include:
- Business logic separation
- Database operations
- Error handling
- Async patterns

Provide complete service implementations."""
        
        return self.generate_code(prompt)
