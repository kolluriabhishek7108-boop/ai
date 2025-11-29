from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.agent import AgentTask, AgentTaskCreate
from app.services.agent_service import AgentService

router = APIRouter(prefix="/agents", tags=["agents"])

agent_service = AgentService()

@router.get("/types")
async def get_agent_types():
    """Get all available agent types"""
    return {
        "agents": [
            {"type": "backend", "name": "Backend Developer", "description": "Generates backend architecture and APIs"},
            {"type": "frontend", "name": "Frontend Developer", "description": "Creates UI components and interfaces"},
            {"type": "database", "name": "Database Designer", "description": "Designs database schema and optimization"},
            {"type": "api_architect", "name": "API Architect", "description": "Designs API architecture and contracts"},
            {"type": "uiux", "name": "UI/UX Designer", "description": "Creates user experience and design systems"},
            {"type": "devops", "name": "DevOps Engineer", "description": "Sets up CI/CD and deployment"},
            {"type": "testing", "name": "Testing Engineer", "description": "Creates comprehensive test suites"},
            {"type": "security", "name": "Security Auditor", "description": "Performs security analysis"},
            {"type": "performance", "name": "Performance Optimizer", "description": "Optimizes code performance"},
            {"type": "docs", "name": "Documentation Writer", "description": "Generates comprehensive documentation"},
            {"type": "code_review", "name": "Code Reviewer", "description": "Reviews and improves code quality"},
            {"type": "image_gen", "name": "Image Generator", "description": "Generates images and assets"},
        ]
    }

@router.post("/tasks", response_model=AgentTask)
async def create_agent_task(task: AgentTaskCreate):
    """Create a new agent task"""
    try:
        return await agent_service.create_task(task)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tasks/{task_id}", response_model=AgentTask)
async def get_agent_task(task_id: str):
    """Get a specific agent task"""
    task = await agent_service.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/analyze")
async def analyze_requirements(requirements: Dict[str, Any]):
    """Analyze user requirements and suggest agent workflow"""
    try:
        analysis = await agent_service.analyze_requirements(requirements.get("text", ""))
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
