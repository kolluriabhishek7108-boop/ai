from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List
from app.models.project import Project, ProjectCreate, ProjectUpdate
from app.services.project_service import ProjectService
from app.services.generation_service import GenerationService

router = APIRouter(prefix="/projects", tags=["projects"])

project_service = ProjectService()
generation_service = GenerationService()

@router.post("", response_model=Project)
async def create_project(project: ProjectCreate):
    """Create a new project"""
    try:
        return await project_service.create_project(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[Project])
async def get_projects():
    """Get all projects"""
    try:
        return await project_service.get_all_projects()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str):
    """Get a specific project"""
    project = await project_service.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=Project)
async def update_project(project_id: str, update: ProjectUpdate):
    """Update a project"""
    project = await project_service.update_project(project_id, update)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/{project_id}")
async def delete_project(project_id: str):
    """Delete a project"""
    success = await project_service.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

@router.post("/{project_id}/generate")
async def generate_application(project_id: str, background_tasks: BackgroundTasks):
    """Start application generation for a project"""
    project = await project_service.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Start generation in background
    background_tasks.add_task(generation_service.generate_app, project_id)
    
    return {
        "message": "Application generation started",
        "project_id": project_id,
        "status": "in_progress"
    }

@router.get("/{project_id}/status")
async def get_generation_status(project_id: str):
    """Get the current generation status"""
    project = await project_service.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {
        "project_id": project_id,
        "status": project.status,
        "progress": project.progress,
        "logs": project.agent_logs[-10:] if project.agent_logs else []  # Last 10 logs
    }

@router.get("/{project_id}/code")
async def get_generated_code(project_id: str):
    """Get the generated code for a project"""
    project = await project_service.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.status != "completed":
        raise HTTPException(status_code=400, detail="Project generation not completed yet")
    
    return {
        "project_id": project_id,
        "code": project.generated_code
    }
