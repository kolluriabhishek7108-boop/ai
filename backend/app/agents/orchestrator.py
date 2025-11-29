from typing import Dict, Any, List, Optional
from app.agents.backend_agent import BackendAgent
from app.agents.frontend_agent import FrontendAgent
from app.agents.database_agent import DatabaseAgent
from app.agents.api_architect_agent import APIArchitectAgent
from app.agents.uiux_designer_agent import UIUXDesignerAgent
from app.agents.devops_agent import DevOpsAgent
from app.agents.testing_agent import TestingAgent
from app.agents.security_agent import SecurityAgent
from app.agents.performance_agent import PerformanceAgent
from app.agents.documentation_agent import DocumentationAgent
from app.agents.code_review_agent import CodeReviewAgent
from app.agents.image_generator_agent import ImageGeneratorAgent
from app.services.websocket_manager import websocket_manager
import logging
import asyncio
from datetime import datetime

logger = logging.getLogger(__name__)

class AgentOrchestrator:
    """
    Advanced orchestrator coordinating 12 specialized agents
    to generate production-ready applications
    """
    
    def __init__(self, llm_provider: str = "emergent", project_id: Optional[str] = None):
        self.llm_provider = llm_provider
        self.project_id = project_id
        
        # Initialize all 12 specialized agents
        self.agents = {
            "database": DatabaseAgent(llm_provider),
            "api_architect": APIArchitectAgent(llm_provider),
            "backend": BackendAgent(llm_provider),
            "uiux_designer": UIUXDesignerAgent(llm_provider),
            "frontend": FrontendAgent(llm_provider),
            "testing": TestingAgent(llm_provider),
            "security": SecurityAgent(llm_provider),
            "performance": PerformanceAgent(llm_provider),
            "devops": DevOpsAgent(llm_provider),
            "documentation": DocumentationAgent(llm_provider),
            "code_review": CodeReviewAgent(llm_provider),
            "image_generator": ImageGeneratorAgent(llm_provider)
        }
        
        self.workflow_logs = []
        self.execution_times = {}
    
    async def generate_application(self, project_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Orchestrate all 12 agents to generate a complete, production-ready application
        
        Workflow:
        1. Requirements Analysis
        2. Database Design
        3. API Architecture
        4. UI/UX Design System
        5. Backend Development
        6. Frontend Development
        7. Security Audit
        8. Performance Optimization
        9. Testing Suite Generation
        10. DevOps Infrastructure
        11. Documentation Generation
        12. Code Review & Quality Assurance
        """
        logger.info(f"🚀 Starting advanced application generation: {project_config.get('name')}")
        start_time = datetime.now()
        
        results = {
            "status": "in_progress",
            "project_name": project_config.get("name"),
            "stages": {},
            "logs": [],
            "metadata": {
                "agents_used": [],
                "total_agents": 12,
                "generation_started": start_time.isoformat()
            }
        }
        
        try:
            requirements = project_config.get("requirements", "")
            platforms = project_config.get("target_platforms", ["react"])
            app_type = project_config.get("app_type", "web")
            architecture = project_config.get("architecture_type", "modular")
            
            # ===== STAGE 1: DATABASE DESIGN =====
            self._log(results, "📊 Stage 1/12: Designing database schema")
            db_result = await self._execute_agent("database", {
                "requirements": requirements,
                "db_type": "mongodb"
            })
            results["stages"]["database"] = db_result
            results["metadata"]["agents_used"].append("database")
            
            # ===== STAGE 2: API ARCHITECTURE =====
            self._log(results, "🔌 Stage 2/12: Designing API architecture")
            api_result = await self._execute_agent("api_architect", {
                "requirements": requirements,
                "app_type": app_type,
                "architecture": "rest"
            })
            results["stages"]["api_architecture"] = api_result
            results["metadata"]["agents_used"].append("api_architect")
            
            # ===== STAGE 3: UI/UX DESIGN SYSTEM =====
            self._log(results, "🎨 Stage 3/12: Creating UI/UX design system")
            design_result = await self._execute_agent("uiux_designer", {
                "requirements": requirements,
                "platform": platforms[0] if platforms else "web",
                "design_style": project_config.get("design_style", "modern")
            })
            results["stages"]["design_system"] = design_result
            results["metadata"]["agents_used"].append("uiux_designer")
            
            # ===== STAGE 4: IMAGE ASSETS =====
            self._log(results, "🖼️  Stage 4/12: Generating image specifications")
            image_result = await self._execute_agent("image_generator", {
                "requirements": requirements,
                "image_types": ["logo", "hero", "icons", "illustrations"],
                "style": project_config.get("design_style", "modern")
            })
            results["stages"]["image_assets"] = image_result
            results["metadata"]["agents_used"].append("image_generator")
            
            # ===== STAGE 5: BACKEND DEVELOPMENT =====
            self._log(results, "⚙️  Stage 5/12: Generating backend code")
            backend_result = await self._execute_agent("backend", {
                "requirements": requirements,
                "project_type": app_type,
                "architecture": architecture,
                "api_spec": api_result.get("api_specification", ""),
                "database_schema": db_result.get("schema", "")
            })
            results["stages"]["backend"] = backend_result
            results["metadata"]["agents_used"].append("backend")
            
            # ===== STAGE 6: FRONTEND DEVELOPMENT =====
            self._log(results, "💻 Stage 6/12: Generating frontend code")
            frontend_results = {}
            api_endpoints = self._extract_api_endpoints(api_result)
            
            for platform in platforms:
                frontend_result = await self._execute_agent("frontend", {
                    "requirements": requirements,
                    "platform": platform,
                    "api_endpoints": api_endpoints,
                    "design_system": design_result.get("design_system", ""),
                    "image_specs": image_result.get("image_specifications", "")
                })
                frontend_results[platform] = frontend_result
            
            results["stages"]["frontend"] = frontend_results
            results["metadata"]["agents_used"].append("frontend")
            
            # ===== STAGE 7: SECURITY AUDIT =====
            self._log(results, "🔒 Stage 7/12: Performing security audit")
            security_result = await self._execute_agent("security", {
                "requirements": requirements,
                "code_context": self._get_code_summary(backend_result, frontend_results),
                "platform": app_type
            })
            results["stages"]["security"] = security_result
            results["metadata"]["agents_used"].append("security")
            
            # ===== STAGE 8: PERFORMANCE OPTIMIZATION =====
            self._log(results, "⚡ Stage 8/12: Optimizing performance")
            performance_result = await self._execute_agent("performance", {
                "requirements": requirements,
                "platform": app_type,
                "code_context": self._get_code_summary(backend_result, frontend_results)
            })
            results["stages"]["performance"] = performance_result
            results["metadata"]["agents_used"].append("performance")
            
            # ===== STAGE 9: TESTING SUITE =====
            self._log(results, "🧪 Stage 9/12: Generating test suites")
            testing_result = await self._execute_agent("testing", {
                "requirements": requirements,
                "platform": platforms[0] if platforms else "web",
                "api_endpoints": api_endpoints
            })
            results["stages"]["testing"] = testing_result
            results["metadata"]["agents_used"].append("testing")
            
            # ===== STAGE 10: DEVOPS INFRASTRUCTURE =====
            self._log(results, "🐳 Stage 10/12: Setting up DevOps infrastructure")
            devops_result = await self._execute_agent("devops", {
                "requirements": requirements,
                "platforms": platforms,
                "deployment_target": project_config.get("deployment_target", "docker")
            })
            results["stages"]["devops"] = devops_result
            results["metadata"]["agents_used"].append("devops")
            
            # ===== STAGE 11: DOCUMENTATION =====
            self._log(results, "📝 Stage 11/12: Generating documentation")
            documentation_result = await self._execute_agent("documentation", {
                "requirements": requirements,
                "project_name": project_config.get("name", "Application"),
                "features": self._extract_features(results),
                "tech_stack": self._build_tech_stack(platforms, architecture)
            })
            results["stages"]["documentation"] = documentation_result
            results["metadata"]["agents_used"].append("documentation")
            
            # ===== STAGE 12: CODE REVIEW =====
            self._log(results, "✅ Stage 12/12: Performing code review")
            review_result = await self._execute_agent("code_review", {
                "code_context": self._get_code_summary(backend_result, frontend_results),
                "platform": app_type
            })
            results["stages"]["code_review"] = review_result
            results["metadata"]["agents_used"].append("code_review")
            
            # ===== FINAL INTEGRATION =====
            self._log(results, "🔗 Integrating all components")
            results["integrated_structure"] = self._integrate_all_components(results["stages"])
            
            # Calculate final metadata
            end_time = datetime.now()
            results["status"] = "completed"
            results["metadata"]["generation_completed"] = end_time.isoformat()
            results["metadata"]["total_duration_seconds"] = (end_time - start_time).total_seconds()
            results["metadata"]["execution_times"] = self.execution_times
            
            self._log(results, f"✨ Application generation completed! Duration: {results['metadata']['total_duration_seconds']:.2f}s")
            
        except Exception as e:
            results["status"] = "failed"
            results["error"] = str(e)
            self._log(results, f"❌ Error: {str(e)}")
            logger.error(f"Application generation failed: {str(e)}", exc_info=True)
        
        return results
    
    async def _execute_agent(self, agent_name: str, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a single agent and track execution time"""
        start = datetime.now()
        agent = self.agents.get(agent_name)
        
        if not agent:
            raise ValueError(f"Agent '{agent_name}' not found")
        
        # Execute agent (synchronous for now, can be made async)
        result = agent.execute(task)
        
        duration = (datetime.now() - start).total_seconds()
        self.execution_times[agent_name] = duration
        
        logger.info(f"Agent '{agent_name}' completed in {duration:.2f}s")
        return result
    
    def _log(self, results: Dict[str, Any], message: str):
        """Add timestamped log entry"""
        timestamp = datetime.now().isoformat()
        log_entry = {
            "timestamp": timestamp,
            "message": message
        }
        results["logs"].append(log_entry)
        logger.info(message)
    
    def _extract_api_endpoints(self, api_result: Dict[str, Any]) -> List[str]:
        """Extract API endpoints from API architecture"""
        # Parse the API specification to extract endpoints
        spec = api_result.get("api_specification", "")
        
        # Simple extraction (can be enhanced with proper parsing)
        endpoints = []
        for method in ["GET", "POST", "PUT", "PATCH", "DELETE"]:
            if method in spec:
                # Extract paths (simplified)
                endpoints.append(f"/api/{method.lower()}")
        
        # Default endpoints if none found
        if not endpoints:
            endpoints = ["/api/items", "/api/users", "/api/auth"]
        
        return endpoints
    
    def _get_code_summary(self, backend_result: Dict[str, Any], frontend_results: Dict[str, Any]) -> str:
        """Create a summary of generated code for review agents"""
        summary = f"Backend Code:\n{str(backend_result)[:1000]}\n\n"
        summary += f"Frontend Code:\n{str(frontend_results)[:1000]}"
        return summary
    
    def _extract_features(self, results: Dict[str, Any]) -> List[str]:
        """Extract implemented features from results"""
        features = []
        
        stages = results.get("stages", {})
        
        if "backend" in stages:
            features.extend(["RESTful API", "Backend Services"])
        if "frontend" in stages:
            features.extend(["User Interface", "Frontend Components"])
        if "database" in stages:
            features.append("Database Schema")
        if "security" in stages:
            features.append("Security Measures")
        if "testing" in stages:
            features.append("Automated Testing")
        if "devops" in stages:
            features.append("CI/CD Pipeline")
        
        return features
    
    def _build_tech_stack(self, platforms: List[str], architecture: str) -> Dict[str, Any]:
        """Build technology stack information"""
        stack = {
            "backend": ["FastAPI", "Python 3.11+", "MongoDB"],
            "platforms": platforms,
            "architecture": architecture,
            "testing": ["Pytest", "Playwright"],
            "devops": ["Docker", "GitHub Actions"],
            "security": ["JWT", "bcrypt", "HTTPS"]
        }
        
        # Add platform-specific technologies
        if "react" in platforms:
            stack["frontend"] = ["React 19", "TailwindCSS", "React Router"]
        elif "nextjs" in platforms:
            stack["frontend"] = ["Next.js 15", "TailwindCSS", "App Router"]
        elif "react_native" in platforms:
            stack["mobile"] = ["React Native", "Expo"]
        
        return stack
    
    def _integrate_all_components(self, stages: Dict[str, Any]) -> Dict[str, Any]:
        """Integrate all generated components into unified structure"""
        integrated = {
            "structure": {
                "backend/": {
                    "app/": {
                        "api/": "API routes",
                        "models/": "Data models",
                        "services/": "Business logic",
                        "core/": "Configuration",
                        "agents/": "Agent system"
                    },
                    "tests/": "Backend tests",
                    "Dockerfile": "Backend container",
                    "requirements.txt": "Python dependencies"
                },
                "frontend/": {
                    "src/": {
                        "components/": "React components",
                        "pages/": "Page components",
                        "services/": "API clients",
                        "hooks/": "Custom hooks",
                        "styles/": "Stylesheets"
                    },
                    "tests/": "Frontend tests",
                    "Dockerfile": "Frontend container",
                    "package.json": "Node dependencies"
                },
                "docs/": {
                    "README.md": "Project overview",
                    "API.md": "API documentation",
                    "DEVELOPER.md": "Development guide",
                    "DEPLOYMENT.md": "Deployment guide"
                },
                "deployment/": {
                    "docker-compose.yml": "Local development",
                    "kubernetes/": "K8s manifests",
                    ".github/workflows/": "CI/CD pipelines"
                }
            },
            "components": {
                "database": stages.get("database", {}),
                "api": stages.get("api_architecture", {}),
                "backend": stages.get("backend", {}),
                "frontend": stages.get("frontend", {}),
                "design_system": stages.get("design_system", {}),
                "security": stages.get("security", {}),
                "performance": stages.get("performance", {}),
                "testing": stages.get("testing", {}),
                "devops": stages.get("devops", {}),
                "documentation": stages.get("documentation", {}),
                "code_review": stages.get("code_review", {})
            },
            "generation_stats": {
                "agents_executed": len(stages),
                "total_agents": 12,
                "execution_times": self.execution_times
            }
        }
        
        return integrated
    
    def get_agent_status(self) -> Dict[str, Any]:
        """Get status of all agents"""
        return {
            "total_agents": len(self.agents),
            "agents": list(self.agents.keys()),
            "capabilities": {
                name: agent.name for name, agent in self.agents.items()
            }
        }
