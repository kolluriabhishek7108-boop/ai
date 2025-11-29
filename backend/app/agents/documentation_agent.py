from app.agents.base_agent import BaseAgent
from typing import Dict, Any

class DocumentationAgent(BaseAgent):
    """Agent specialized in generating comprehensive documentation"""
    
    def __init__(self, llm_provider: str = "emergent"):
        super().__init__("Documentation_Writer", llm_provider)
    
    def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive project documentation"""
        self.log("Starting documentation generation")
        
        requirements = task.get("requirements", "")
        project_name = task.get("project_name", "Application")
        features = task.get("features", [])
        tech_stack = task.get("tech_stack", {})
        
        prompt = f"""Create comprehensive documentation for:

Project: {project_name}
Requirements: {requirements}
Features: {', '.join(features) if features else 'N/A'}
Tech Stack: {tech_stack}

Generate complete documentation including:

1. **README.md**:
   - Project overview and description
   - Key features list
   - Technology stack
   - Prerequisites
   - Installation instructions
   - Environment setup
   - Running locally
   - Building for production
   - Project structure overview
   - Contributing guidelines
   - License information

2. **API Documentation** (API.md):
   - API overview
   - Authentication
   - Base URL and versioning
   - All endpoints with:
     * Method and path
     * Description
     * Request parameters
     * Request body schema
     * Response schema
     * Example requests
     * Example responses
     * Error codes
   - Rate limiting
   - Pagination
   - Filtering and sorting

3. **Developer Guide** (DEVELOPER.md):
   - Architecture overview
   - Folder structure explanation
   - Code organization
   - Design patterns used
   - State management
   - Database schema
   - Authentication flow
   - Development workflow
   - Debugging tips
   - Common issues and solutions

4. **Deployment Guide** (DEPLOYMENT.md):
   - Deployment options
   - Docker deployment
   - Kubernetes deployment
   - Cloud provider setup (AWS, GCP, Azure)
   - Environment variables
   - Database setup
   - SSL/TLS configuration
   - Monitoring setup
   - Backup procedures
   - Rollback procedures

5. **User Guide** (USER_GUIDE.md):
   - Getting started
   - Feature walkthroughs
   - Screenshots/diagrams
   - Common workflows
   - FAQ
   - Troubleshooting

6. **Component Documentation**:
   - Frontend component documentation
   - Props and usage examples
   - Styling guidelines
   - Accessibility notes

7. **Database Documentation**:
   - Schema diagrams
   - Table descriptions
   - Relationships
   - Indexing strategy
   - Migration guides

8. **Testing Documentation**:
   - Testing strategy
   - Running tests
   - Writing new tests
   - Test coverage requirements

9. **Security Documentation**:
   - Security measures
   - Authentication/authorization
   - Data protection
   - Compliance information

10. **Changelog** (CHANGELOG.md):
    - Version history format
    - Release notes template

Generate all documentation in Markdown format with proper formatting and examples."""
        
        documentation = self.generate_code(prompt, {
            "project_name": project_name,
            "features": features,
            "tech_stack": tech_stack
        })
        
        self.log("Documentation generation completed")
        
        return {
            "agent": self.name,
            "status": "completed",
            "documentation": documentation,
            "documents_created": [
                "README.md",
                "API.md",
                "DEVELOPER.md",
                "DEPLOYMENT.md",
                "USER_GUIDE.md",
                "CHANGELOG.md"
            ],
            "total_sections": 10
        }