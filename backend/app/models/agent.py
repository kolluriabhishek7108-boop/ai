from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import uuid

class AgentTask(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    agent_type: str  # backend, frontend, database, api_architect, etc.
    task_description: str
    status: str = "pending"  # pending, running, completed, failed
    result: Optional[str] = None
    error: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None
    dependencies: List[str] = []  # IDs of tasks this depends on
    metadata: Dict[str, Any] = {}

class AgentTaskCreate(BaseModel):
    agent_type: str
    task_description: str
    dependencies: List[str] = []
    metadata: Dict[str, Any] = {}

class WorkflowStep(BaseModel):
    step_number: int
    agent_type: str
    description: str
    depends_on: List[int] = []  # Step numbers this depends on
    estimated_duration: int = 60  # seconds
