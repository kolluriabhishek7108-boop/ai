from typing import Dict, Any
from app.agents.base_agent import BaseAgent

class FrontendAgent(BaseAgent):
    """Specialized agent for frontend development"""
    
    def __init__(self, llm_provider: str = "emergent"):
        super().__init__("FrontendAgent", llm_provider)
        self.expertise = "Frontend architecture, UI components, state management, responsive design"
    
    def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute frontend development task"""
        self.log("Starting frontend development task")
        
        platform = task.get("platform", "react")
        requirements = task.get("requirements", "")
        api_endpoints = task.get("api_endpoints", [])
        
        # Generate frontend structure
        structure = self._generate_structure(platform)
        
        # Generate components
        components_code = self._generate_components(requirements, platform)
        
        # Generate API integration
        api_integration = self._generate_api_integration(api_endpoints, platform)
        
        # Generate routing
        routing_code = self._generate_routing(requirements, platform)
        
        return {
            "status": "success",
            "structure": structure,
            "components_code": components_code,
            "api_integration": api_integration,
            "routing_code": routing_code,
            "message": "Frontend architecture generated successfully"
        }
    
    def _generate_structure(self, platform: str) -> Dict[str, Any]:
        """Generate frontend folder structure based on platform"""
        if platform == "react" or platform == "nextjs":
            return {
                "src/": {
                    "components/": {"common/": {}, "features/": {}},
                    "pages/": {},
                    "services/": {"api.js": ""},
                    "hooks/": {},
                    "utils/": {},
                    "context/": {},
                    "styles/": {},
                    "App.js": "",
                    "index.js": ""
                },
                "public/": {},
                "package.json": ""
            }
        elif platform == "react-native":
            return {
                "src/": {
                    "components/": {},
                    "screens/": {},
                    "navigation/": {},
                    "services/": {},
                    "hooks/": {},
                    "utils/": {},
                    "styles/": {},
                    "App.js": ""
                },
                "package.json": ""
            }
        return {}
    
    def _generate_components(self, requirements: str, platform: str) -> str:
        """Generate React/React Native components"""
        framework = "React Native" if platform == "react-native" else "React"
        prompt = f"""Generate {framework} components for:

{requirements}

Include:
- Functional components with hooks
- Proper prop types
- Responsive design
- Accessibility features
- Modern patterns (composition, custom hooks)
- TailwindCSS for web, StyleSheet for React Native

Provide complete, production-ready components."""
        
        return self.generate_code(prompt)
    
    def _generate_api_integration(self, api_endpoints: list, platform: str) -> str:
        """Generate API integration layer"""
        endpoints_str = "\n".join([f"- {ep}" for ep in api_endpoints]) if api_endpoints else "Standard CRUD operations"
        
        prompt = f"""Generate API integration service for {platform}:

API Endpoints:
{endpoints_str}

Include:
- Axios or fetch wrapper
- Error handling
- Request/response interceptors
- Token management
- Loading states

Provide complete API service implementation."""
        
        return self.generate_code(prompt)
    
    def _generate_routing(self, requirements: str, platform: str) -> str:
        """Generate routing configuration"""
        router = "React Router" if platform in ["react", "nextjs"] else "React Navigation"
        
        prompt = f"""Generate {router} configuration for:

{requirements}

Include:
- Route definitions
- Protected routes
- Navigation structure
- Deep linking (if mobile)

Provide complete routing setup."""
        
        return self.generate_code(prompt)
