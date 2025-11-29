from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.agent import AgentTask, AgentTaskCreate
from app.services.agent_service import AgentService

router = APIRouter(prefix="/agents", tags=["agents"])

agent_service = AgentService()

@router.get("/types")
async def get_agent_types():
    """Get all 12 available specialized agent types"""
    return {
        "total_agents": 12,
        "agents": [
            {
                "id": 1,
                "type": "database",
                "name": "Database Designer",
                "icon": "🗄️",
                "description": "Designs comprehensive MongoDB schemas, relationships, and optimization strategies",
                "capabilities": ["Schema Design", "Indexing", "Query Optimization", "Data Modeling"],
                "output": "Database schema, migrations, optimization guides"
            },
            {
                "id": 2,
                "type": "api_architect",
                "name": "API Architect",
                "icon": "🔌",
                "description": "Designs RESTful API architecture, endpoints, and contracts",
                "capabilities": ["REST API Design", "Authentication", "Rate Limiting", "OpenAPI Specs"],
                "output": "API specification, endpoint documentation, auth strategy"
            },
            {
                "id": 3,
                "type": "backend",
                "name": "Backend Developer",
                "icon": "⚙️",
                "description": "Generates modular backend code with FastAPI/Express architecture",
                "capabilities": ["FastAPI Development", "Modular Architecture", "Business Logic", "Services"],
                "output": "Complete backend codebase with routes, services, models"
            },
            {
                "id": 4,
                "type": "uiux",
                "name": "UI/UX Designer",
                "icon": "🎨",
                "description": "Creates comprehensive design systems and component libraries",
                "capabilities": ["Design System", "Color Palettes", "Typography", "Accessibility"],
                "output": "Design system, component specs, style guides"
            },
            {
                "id": 5,
                "type": "frontend",
                "name": "Frontend Developer",
                "icon": "💻",
                "description": "Creates responsive UI with React/Next.js/React Native",
                "capabilities": ["React Development", "Responsive Design", "State Management", "Routing"],
                "output": "Complete frontend application with components and pages"
            },
            {
                "id": 6,
                "type": "image_generator",
                "name": "Image Generator",
                "icon": "🖼️",
                "description": "Generates visual assets specifications and image guidelines",
                "capabilities": ["Logo Design", "Icons", "Illustrations", "Asset Management"],
                "output": "Image specifications, AI generation prompts, SVG code"
            },
            {
                "id": 7,
                "type": "security",
                "name": "Security Auditor",
                "icon": "🔒",
                "description": "Performs security audits and implements security measures",
                "capabilities": ["Vulnerability Detection", "OWASP Compliance", "Auth Security", "Encryption"],
                "output": "Security audit report, security implementations"
            },
            {
                "id": 8,
                "type": "performance",
                "name": "Performance Optimizer",
                "icon": "⚡",
                "description": "Optimizes code, queries, and application performance",
                "capabilities": ["Code Optimization", "Caching", "Query Optimization", "Bundle Size"],
                "output": "Performance optimization plan and implementations"
            },
            {
                "id": 9,
                "type": "testing",
                "name": "Testing Engineer",
                "icon": "🧪",
                "description": "Creates comprehensive test suites for all layers",
                "capabilities": ["Unit Testing", "Integration Tests", "E2E Tests", "Performance Tests"],
                "output": "Complete test suite with >85% coverage"
            },
            {
                "id": 10,
                "type": "devops",
                "name": "DevOps Engineer",
                "icon": "🐳",
                "description": "Sets up CI/CD pipelines and deployment infrastructure",
                "capabilities": ["Docker", "Kubernetes", "CI/CD", "Monitoring"],
                "output": "Docker configs, K8s manifests, CI/CD pipelines"
            },
            {
                "id": 11,
                "type": "documentation",
                "name": "Documentation Writer",
                "icon": "📝",
                "description": "Generates comprehensive technical documentation",
                "capabilities": ["README", "API Docs", "Developer Guides", "User Guides"],
                "output": "Complete documentation set (README, API docs, guides)"
            },
            {
                "id": 12,
                "type": "code_review",
                "name": "Code Reviewer",
                "icon": "✅",
                "description": "Reviews code quality, best practices, and maintainability",
                "capabilities": ["Code Quality", "Best Practices", "Refactoring", "Quality Score"],
                "output": "Code review report with recommendations"
            }
        ],
        "workflow": [
            "Database Design → API Architecture → Backend Development",
            "UI/UX Design → Image Assets → Frontend Development",
            "Security Audit → Performance Optimization → Testing",
            "DevOps Setup → Documentation → Code Review"
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
