"""
WebSocket API routes for real-time communication
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_manager import websocket_manager
import logging
import json

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ws", tags=["websocket"])

@router.websocket("/projects/{project_id}")
async def websocket_endpoint(websocket: WebSocket, project_id: str):
    """
    WebSocket endpoint for real-time project updates
    Clients connect to receive live updates about project generation
    """
    await websocket_manager.connect(websocket, project_id)
    
    try:
        # Send welcome message
        await websocket_manager.send_personal_message(
            {
                "type": "connection",
                "message": f"Connected to project {project_id}",
                "project_id": project_id
            },
            websocket
        )
        
        # Keep connection alive and handle incoming messages
        while True:
            data = await websocket.receive_text()
            
            # Handle ping/pong for keep-alive
            try:
                message = json.loads(data)
                if message.get("type") == "ping":
                    await websocket_manager.send_personal_message(
                        {"type": "pong"},
                        websocket
                    )
            except json.JSONDecodeError:
                logger.warning(f"Received invalid JSON from client: {data}")
    
    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket, project_id)
        logger.info(f"Client disconnected from project {project_id}")
    
    except Exception as e:
        logger.error(f"WebSocket error for project {project_id}: {e}")
        await websocket_manager.disconnect(websocket, project_id)
