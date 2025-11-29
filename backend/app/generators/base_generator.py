"""
Base Generator Class for Code Generation
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
import json


class BaseGenerator(ABC):
    """Abstract base class for all code generators"""
    
    def __init__(self, project_config: Dict[str, Any], agent_outputs: Dict[str, Any]):
        self.project_config = project_config
        self.agent_outputs = agent_outputs
        self.platform = project_config.get("platforms", [])[0] if project_config.get("platforms") else "web"
        self.architecture = project_config.get("architecture", "modular")
        self.project_name = project_config.get("name", "my_app").lower().replace(" ", "_")
    
    @abstractmethod
    def generate_structure(self) -> Dict[str, Any]:
        """Generate the file structure for the platform"""
        pass
    
    @abstractmethod
    def generate_files(self) -> Dict[str, str]:
        """Generate all code files for the platform"""
        pass
    
    def create_package_json(self, dependencies: Dict[str, str], 
                          dev_dependencies: Dict[str, str],
                          scripts: Dict[str, str]) -> str:
        """Create package.json content"""
        package = {
            "name": self.project_name,
            "version": "1.0.0",
            "description": self.project_config.get("description", ""),
            "private": True,
            "scripts": scripts,
            "dependencies": dependencies,
            "devDependencies": dev_dependencies
        }
        return json.dumps(package, indent=2)
    
    def create_requirements_txt(self, packages: List[str]) -> str:
        """Create requirements.txt content for Python projects"""
        return "\n".join(packages)
    
    def create_readme(self) -> str:
        """Create README.md content"""
        project_name = self.project_config.get("name", "Project")
        description = self.project_config.get("description", "No description")
        return f"# {project_name}\n\n{description}\n\n## Setup\n\nRefer to documentation for setup instructions.\n"
    
    def generate_env_files(self) -> Dict[str, str]:
        """Generate environment configuration files"""
        db_name = self.project_name
        backend_env = f"MONGODB_URL=mongodb://localhost:27017/\nDB_NAME={db_name}\nJWT_SECRET=change-me\n"
        frontend_env = "REACT_APP_API_URL=http://localhost:8001/api\n"
        
        return {
            "backend/.env.example": backend_env,
            "frontend/.env.example": frontend_env
        }
