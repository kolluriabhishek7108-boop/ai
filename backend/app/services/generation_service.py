from app.agents.orchestrator import AgentOrchestrator
from app.services.project_service import ProjectService
from app.models.project import ProjectUpdate
import logging

logger = logging.getLogger(__name__)

class GenerationService:
    """Service for handling application generation"""
    
    def __init__(self):
        self.project_service = ProjectService()
    
    async def generate_app(self, project_id: str):
        """Generate application for a project"""
        try:
            logger.info(f"Starting generation for project: {project_id}")
            
            # Get project
            project = await self.project_service.get_project(project_id)
            if not project:
                logger.error(f"Project not found: {project_id}")
                return
            
            # Update status to in_progress
            await self.project_service.update_project(
                project_id,
                ProjectUpdate(status="in_progress", progress=10)
            )
            
            # Create orchestrator with project_id for WebSocket broadcasting
            orchestrator = AgentOrchestrator(project_id=project_id)
            
            # Generate application using orchestrator
            result = await orchestrator.generate_application({
                "name": project.name,
                "requirements": project.requirements,
                "app_type": project.app_type,
                "target_platforms": project.target_platforms,
                "architecture_type": project.architecture_type
            })
            
            # Update project with results
            if result["status"] == "completed":
                await self.project_service.update_project(
                    project_id,
                    ProjectUpdate(
                        status="completed",
                        progress=100,
                        generated_code=result.get("integrated_structure", {}),
                        agent_logs=result.get("logs", [])
                    )
                )
                logger.info(f"Generation completed for project: {project_id}")
            else:
                await self.project_service.update_project(
                    project_id,
                    ProjectUpdate(
                        status="failed",
                        progress=0,
                        agent_logs=result.get("logs", [])
                    )
                )
                logger.error(f"Generation failed for project: {project_id}")
        
        except Exception as e:
            logger.error(f"Error generating app for project {project_id}: {str(e)}")
            await self.project_service.update_project(
                project_id,
                ProjectUpdate(status="failed", progress=0)
            )
