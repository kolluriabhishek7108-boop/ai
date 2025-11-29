"""
Web Platform Generator - Generates React applications
"""
from typing import Dict, Any
from .base_generator import BaseGenerator


class WebGenerator(BaseGenerator):
    """Generator for web applications (React)"""
    
    def generate_structure(self) -> Dict[str, Any]:
        """Generate React application structure"""
        return {
            "frontend": {
                "src": {
                    "components": {},
                    "pages": {},
                    "services": {},
                    "App.js": None
                },
                "package.json": None
            },
            "backend": {
                "app": {
                    "api": {},
                    "models": {},
                    "services": {}
                },
                "main.py": None
            }
        }
    
    def generate_files(self) -> Dict[str, str]:
        """Generate all web application files"""
        files = {}
        
        # Frontend package.json
        files["frontend/package.json"] = self.create_package_json(
            dependencies={
                "react": "^19.0.0",
                "react-dom": "^19.0.0",
                "axios": "^1.6.0"
            },
            dev_dependencies={
                "vite": "^5.0.0"
            },
            scripts={
                "dev": "vite",
                "build": "vite build"
            }
        )
        
        # Main App component
        project_name = self.project_config.get("name", "My App")
        files["frontend/src/App.js"] = f"""import React from 'react';

function App() {{
  return (
    <div>
      <h1>{project_name}</h1>
      <p>Welcome to your generated application!</p>
    </div>
  );
}}

export default App;
"""
        
        # Backend main.py
        files["backend/main.py"] = """from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "API is running"}
"""
        
        # Backend requirements
        files["backend/requirements.txt"] = self.create_requirements_txt([
            "fastapi==0.109.0",
            "uvicorn[standard]==0.27.0"
        ])
        
        # Environment files
        files.update(self.generate_env_files())
        
        # README
        files["README.md"] = self.create_readme()
        
        return files
