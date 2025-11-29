from typing import Dict, Any
from app.agents.base_agent import BaseAgent

class DatabaseAgent(BaseAgent):
    """Specialized agent for database design and optimization"""
    
    def __init__(self, llm_provider: str = "emergent"):
        super().__init__("DatabaseAgent", llm_provider)
        self.expertise = "Database design, schema optimization, indexing, relationships"
    
    def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute database design task"""
        self.log("Starting database design task")
        
        requirements = task.get("requirements", "")
        db_type = task.get("db_type", "mongodb")
        
        # Design schema
        schema = self._design_schema(requirements, db_type)
        
        # Generate indexes
        indexes = self._generate_indexes(requirements, db_type)
        
        # Design relationships
        relationships = self._design_relationships(requirements)
        
        return {
            "status": "success",
            "schema": schema,
            "indexes": indexes,
            "relationships": relationships,
            "message": "Database design completed successfully"
        }
    
    def _design_schema(self, requirements: str, db_type: str) -> str:
        """Design database schema"""
        prompt = f"""Design a {db_type} database schema for:

{requirements}

Provide:
- Collection/table definitions
- Field types and constraints
- Data validation rules
- Efficient data structures
- Scalability considerations

Format as JSON schema or code."""
        
        return self.generate_code(prompt)
    
    def _generate_indexes(self, requirements: str, db_type: str) -> str:
        """Generate optimal indexes"""
        prompt = f"""Design indexes for {db_type} based on:

{requirements}

Include:
- Primary indexes
- Compound indexes for common queries
- Text search indexes if needed
- Performance considerations

Provide index creation commands."""
        
        return self.generate_code(prompt)
    
    def _design_relationships(self, requirements: str) -> str:
        """Design data relationships"""
        prompt = f"""Design data relationships for:

{requirements}

Explain:
- Entity relationships
- Embedding vs referencing strategy
- Data normalization approach
- Query patterns

Provide relationship diagram as text/code."""
        
        return self.generate_code(prompt)
