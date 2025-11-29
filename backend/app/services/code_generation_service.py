"""
Code Generation Service
Orchestrates the entire code generation process
"""
from typing import Dict, Any, Optional
import os
import zipfile
import tempfile
from pathlib import Path
import logging

from ..generators.web_generator import WebGenerator
from ..generators.mobile_generator import MobileGenerator
from ..generators.desktop_generator import DesktopGenerator
from ..agents.orchestrator import AgentOrchestrator

logger = logging.getLogger(__name__)


class CodeGenerationService:
    """Service for generating complete applications"""
    
    def __init__(self):
        self.orchestrator = AgentOrchestrator()
        self.generators = {
            "web": WebGenerator,
            "mobile": MobileGenerator,
            "desktop": DesktopGenerator
        }
    
    async def generate_application(self, project_config: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a complete application"""
        logger.info(f"Starting generation for: {project_config.get('name')}")
        
        try:
            # Run agents
            agent_outputs = await self.orchestrator.orchestrate(project_config)
            
            # Generate code for each platform
            platforms = project_config.get("platforms", ["web"])
            generated_files = {}
            file_structures = {}
            
            for platform in platforms:
                platform_files, structure = await self._generate_platform_code(
                    platform, project_config, agent_outputs
                )
                generated_files[platform] = platform_files
                file_structures[platform] = structure
            
            # Create deployment package
            package_path = await self._create_deployment_package(
                project_config, generated_files
            )
            
            return {
                "success": True,
                "project_name": project_config.get("name"),
                "platforms": platforms,
                "file_structures": file_structures,
                "package_path": package_path,
                "agent_outputs": agent_outputs,
                "statistics": {
                    "total_files": sum(len(files) for files in generated_files.values()),
                    "total_agents": len(agent_outputs),
                    "platforms_generated": len(platforms)
                }
            }
            
        except Exception as e:
            logger.error(f"Error: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _generate_platform_code(
        self, 
        platform: str, 
        project_config: Dict[str, Any],
        agent_outputs: Dict[str, Any]
    ) -> tuple:
        """Generate code for a specific platform"""
        generator_class = self.generators.get(platform)
        if not generator_class:
            raise ValueError(f"Unsupported platform: {platform}")
        
        generator = generator_class(project_config, agent_outputs)
        structure = generator.generate_structure()
        files = generator.generate_files()
        
        return files, structure
    
    async def _create_deployment_package(
        self,
        project_config: Dict[str, Any],
        generated_files: Dict[str, Dict[str, str]]
    ) -> str:
        """Create a ZIP package with all generated code"""
        project_name = project_config.get("name", "my_app").lower().replace(" ", "_")
        
        temp_dir = tempfile.mkdtemp()
        project_dir = Path(temp_dir) / project_name
        project_dir.mkdir(exist_ok=True)
        
        # Write all files
        for platform, files in generated_files.items():
            for file_path, content in files.items():
                full_path = project_dir / file_path
                full_path.parent.mkdir(parents=True, exist_ok=True)
                
                if content:
                    with open(full_path, 'w', encoding='utf-8') as f:
                        f.write(content)
        
        # Create ZIP
        zip_path = Path(temp_dir) / f"{project_name}.zip"
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(project_dir):
                for file in files:
                    file_path = Path(root) / file
                    arcname = file_path.relative_to(project_dir)
                    zipf.write(file_path, arcname)
        
        logger.info(f"Package created: {zip_path}")
        return str(zip_path)
    
    async def get_project_code(self, project_id: str) -> Optional[str]:
        """Get the generated code package path"""
        return None
    
    def validate_project_config(self, project_config: Dict[str, Any]) -> tuple:
        """Validate project configuration"""
        required_fields = ["name", "description", "platforms"]
        
        for field in required_fields:
            if field not in project_config:
                return False, f"Missing required field: {field}"
        
        platforms = project_config.get("platforms", [])
        if not platforms:
            return False, "At least one platform must be specified"
        
        valid_platforms = ["web", "mobile", "desktop"]
        for platform in platforms:
            if platform not in valid_platforms:
                return False, f"Invalid platform: {platform}"
        
        return True, None
