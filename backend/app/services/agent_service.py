from typing import Optional, Dict, Any
from app.models.agent import AgentTask, AgentTaskCreate
from app.core.llm_client import LLMClient
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone

class AgentService:
    """Service for managing agent tasks"""
    
    def __init__(self):
        mongo_url = os.environ.get('MONGO_URL')
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client[os.environ.get('DB_NAME', 'agent_generator')]
        self.collection = self.db.agent_tasks
        self.llm_client = LLMClient()
    
    async def create_task(self, task_data: AgentTaskCreate) -> AgentTask:
        """Create a new agent task"""
        task = AgentTask(**task_data.model_dump())
        doc = task.model_dump()
        
        # Convert datetime to ISO string
        doc['created_at'] = doc['created_at'].isoformat()
        if doc.get('completed_at'):
            doc['completed_at'] = doc['completed_at'].isoformat()
        
        await self.collection.insert_one(doc)
        return task
    
    async def get_task(self, task_id: str) -> Optional[AgentTask]:
        """Get a task by ID"""
        doc = await self.collection.find_one({"id": task_id}, {"_id": 0})
        if not doc:
            return None
        
        # Convert ISO strings back to datetime
        if isinstance(doc.get('created_at'), str):
            doc['created_at'] = datetime.fromisoformat(doc['created_at'])
        if doc.get('completed_at') and isinstance(doc['completed_at'], str):
            doc['completed_at'] = datetime.fromisoformat(doc['completed_at'])
        
        return AgentTask(**doc)
    
    async def analyze_requirements(self, requirements_text: str) -> Dict[str, Any]:
        """Analyze requirements and suggest agent workflow"""
        analysis = self.llm_client.analyze_requirements(requirements_text)
        
        # Add suggested agent workflow
        workflow = self._suggest_workflow(analysis)
        analysis['suggested_workflow'] = workflow
        
        return analysis
    
    def _suggest_workflow(self, analysis: Dict[str, Any]) -> list:
        """Suggest agent workflow based on analysis"""
        workflow = [
            {"step": 1, "agent": "database", "description": "Design database schema"},
            {"step": 2, "agent": "api_architect", "description": "Design API architecture"},
            {"step": 3, "agent": "backend", "description": "Implement backend"},
            {"step": 4, "agent": "frontend", "description": "Implement frontend"},
            {"step": 5, "agent": "testing", "description": "Generate tests"},
            {"step": 6, "agent": "security", "description": "Security audit"},
            {"step": 7, "agent": "performance", "description": "Performance optimization"},
            {"step": 8, "agent": "docs", "description": "Generate documentation"},
            {"step": 9, "agent": "devops", "description": "Setup deployment"},
        ]
        
        app_type = analysis.get('app_type', 'web')
        if app_type == 'mobile':
            workflow.insert(4, {"step": 5, "agent": "uiux", "description": "Design mobile UI/UX"})
        
        return workflow
