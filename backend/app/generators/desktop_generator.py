"""
Desktop Platform Generator - Generates Electron applications
"""
from typing import Dict, Any
from .base_generator import BaseGenerator


class DesktopGenerator(BaseGenerator):
    """Generator for desktop applications (Electron)"""
    
    def generate_structure(self) -> Dict[str, Any]:
        """Generate Electron application structure"""
        return {
            "desktop": {
                "src": {
                    "main": {},
                    "renderer": {}
                },
                "package.json": None
            }
        }
    
    def generate_files(self) -> Dict[str, str]:
        """Generate all desktop application files"""
        files = {}
        
        files["desktop/package.json"] = self.create_package_json(
            dependencies={
                "electron": "^28.0.0",
                "react": "^19.0.0"
            },
            dev_dependencies={
                "electron-builder": "^24.9.0"
            },
            scripts={
                "electron": "electron .",
                "build": "electron-builder"
            }
        )
        
        files["README.md"] = self.create_readme()
        
        return files
