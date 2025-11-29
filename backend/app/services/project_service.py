from typing import List, Optional
from app.models.project import Project, ProjectCreate, ProjectUpdate
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone

class ProjectService:
    """Service for managing projects"""
    
    def __init__(self):
        mongo_url = os.environ.get('MONGO_URL')
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client[os.environ.get('DB_NAME', 'agent_generator')]
        self.collection = self.db.projects
    
    async def create_project(self, project_data: ProjectCreate) -> Project:
        """Create a new project"""
        project = Project(**project_data.model_dump())
        doc = project.model_dump()
        
        # Convert datetime to ISO string for MongoDB
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await self.collection.insert_one(doc)
        return project
    
    async def get_all_projects(self) -> List[Project]:
        """Get all projects"""
        projects = await self.collection.find({}, {"_id": 0}).to_list(1000)
        
        # Convert ISO strings back to datetime
        for proj in projects:
            if isinstance(proj.get('created_at'), str):
                proj['created_at'] = datetime.fromisoformat(proj['created_at'])
            if isinstance(proj.get('updated_at'), str):
                proj['updated_at'] = datetime.fromisoformat(proj['updated_at'])
        
        return [Project(**proj) for proj in projects]
    
    async def get_project(self, project_id: str) -> Optional[Project]:
        """Get a project by ID"""
        doc = await self.collection.find_one({"id": project_id}, {"_id": 0})
        if not doc:
            return None
        
        # Convert ISO strings back to datetime
        if isinstance(doc.get('created_at'), str):
            doc['created_at'] = datetime.fromisoformat(doc['created_at'])
        if isinstance(doc.get('updated_at'), str):
            doc['updated_at'] = datetime.fromisoformat(doc['updated_at'])
        
        return Project(**doc)
    
    async def update_project(self, project_id: str, update_data: ProjectUpdate) -> Optional[Project]:
        """Update a project"""
        update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        result = await self.collection.update_one(
            {"id": project_id},
            {"$set": update_dict}
        )
        
        if result.modified_count == 0:
            return None
        
        return await self.get_project(project_id)
    
    async def delete_project(self, project_id: str) -> bool:
        """Delete a project"""
        result = await self.collection.delete_one({"id": project_id})
        return result.deleted_count > 0
