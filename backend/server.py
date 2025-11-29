"""
Main server file - imports from modular app structure
This maintains backward compatibility while using the new architecture
"""
from app.main import app

# Export app for uvicorn
__all__ = ["app"]