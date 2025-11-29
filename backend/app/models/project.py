from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import uuid

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    app_type: str  # web, mobile, desktop, multi-platform
    target_platforms: List[str] = []  # react, nextjs, react-native, electron, flutter
    requirements: str
    architecture_type: str = "modular"  # modular, microservices, monolithic
    features: List[str] = []
    tech_stack: Dict[str, Any] = {}
    status: str = "pending"  # pending, in_progress, completed, failed
    progress: int = 0  # 0-100
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    generated_code: Dict[str, Any] = {}  # Store generated code structure
    agent_logs: List[Dict[str, Any]] = []

class ProjectCreate(BaseModel):
    name: str
    description: str
    requirements: str
    app_type: str = "web"
    target_platforms: List[str] = ["react"]
    architecture_type: str = "modular"

class ProjectUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[int] = None
    generated_code: Optional[Dict[str, Any]] = None
    agent_logs: Optional[List[Dict[str, Any]]] = None
