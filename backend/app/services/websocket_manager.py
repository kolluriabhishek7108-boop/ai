"""
WebSocket Manager for real-time communication
Handles WebSocket connections, broadcasting, and room management
"""
from fastapi import WebSocket
from typing import Dict, List, Set
import json
import logging
import asyncio

logger = logging.getLogger(__name__)

class WebSocketManager:
    """Manages WebSocket connections for real-time updates"""
    
    def __init__(self):
        # Store active connections by project_id
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        self.lock = asyncio.Lock()
    
    async def connect(self, websocket: WebSocket, project_id: str):
        """Accept a new WebSocket connection for a project"""
        await websocket.accept()
        async with self.lock:
            if project_id not in self.active_connections:
                self.active_connections[project_id] = set()
            self.active_connections[project_id].add(websocket)
        logger.info(f"WebSocket connected for project {project_id}. Total connections: {len(self.active_connections[project_id])}")
    
    async def disconnect(self, websocket: WebSocket, project_id: str):
        """Remove a WebSocket connection"""
        async with self.lock:
            if project_id in self.active_connections:
                self.active_connections[project_id].discard(websocket)
                if not self.active_connections[project_id]:
                    del self.active_connections[project_id]
        logger.info(f"WebSocket disconnected for project {project_id}")
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send a message to a specific WebSocket"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
    
    async def broadcast_to_project(self, project_id: str, message: dict):
        """Broadcast a message to all connections for a specific project"""
        if project_id not in self.active_connections:
            return
        
        disconnected = []
        async with self.lock:
            connections = self.active_connections.get(project_id, set()).copy()
        
        for connection in connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to project {project_id}: {e}")
                disconnected.append(connection)
        
        # Remove disconnected clients
        if disconnected:
            async with self.lock:
                for conn in disconnected:
                    if project_id in self.active_connections:
                        self.active_connections[project_id].discard(conn)
    
    async def broadcast_status_update(self, project_id: str, status: str, progress: int = 0):
        """Broadcast project status update"""
        message = {
            "type": "status_update",
            "project_id": project_id,
            "status": status,
            "progress": progress,
            "timestamp": None  # Will be added by serialization
        }
        await self.broadcast_to_project(project_id, message)
    
    async def broadcast_agent_update(self, project_id: str, agent_name: str, agent_status: str, message_text: str):
        """Broadcast agent activity update"""
        message = {
            "type": "agent_update",
            "project_id": project_id,
            "agent": agent_name,
            "agent_status": agent_status,
            "message": message_text,
            "timestamp": None
        }
        await self.broadcast_to_project(project_id, message)
    
    async def broadcast_log(self, project_id: str, log_message: str, log_level: str = "info"):
        """Broadcast a log message"""
        message = {
            "type": "log",
            "project_id": project_id,
            "level": log_level,
            "message": log_message,
            "timestamp": None
        }
        await self.broadcast_to_project(project_id, message)
    
    async def broadcast_completion(self, project_id: str, success: bool, download_url: str = None):
        """Broadcast generation completion"""
        message = {
            "type": "completion",
            "project_id": project_id,
            "success": success,
            "download_url": download_url,
            "timestamp": None
        }
        await self.broadcast_to_project(project_id, message)
    
    def get_connection_count(self, project_id: str = None) -> int:
        """Get the number of active connections"""
        if project_id:
            return len(self.active_connections.get(project_id, set()))
        return sum(len(conns) for conns in self.active_connections.values())

# Global WebSocket manager instance
websocket_manager = WebSocketManager()
