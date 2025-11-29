from app.agents.base_agent import BaseAgent
from typing import Dict, Any

class CodeReviewAgent(BaseAgent):
    """Agent specialized in code review and quality assurance"""
    
    def __init__(self, llm_provider: str = "emergent"):
        super().__init__("Code_Reviewer", llm_provider)
    
    def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Perform comprehensive code review"""
        self.log("Starting code review")
        
        code_context = task.get("code_context", "")
        platform = task.get("platform", "web")
        
        prompt = f"""Perform comprehensive code review and quality assurance:

Platform: {platform}
Code Context: {code_context[:2000] if code_context else 'Complete application codebase'}

Provide detailed review covering:

1. **Code Quality**:
   - Code readability and clarity
   - Naming conventions
   - Function/method length
   - Cyclomatic complexity
   - Code duplication (DRY principle)
   - Single Responsibility Principle
   - SOLID principles adherence

2. **Best Practices**:
   - Language-specific best practices
   - Framework conventions (React, FastAPI, etc.)
   - Design patterns implementation
   - Error handling patterns
   - Logging best practices
   - Configuration management

3. **Performance Review**:
   - Potential performance bottlenecks
   - Inefficient algorithms
   - Database query optimization
   - Memory leaks
   - Unnecessary re-renders (React)
   - Bundle size concerns

4. **Security Review**:
   - Security vulnerabilities
   - Input validation
   - SQL injection risks
   - XSS vulnerabilities
   - Authentication issues
   - Authorization flaws
   - Sensitive data exposure

5. **Type Safety**:
   - Type annotations (Python)
   - TypeScript usage (if applicable)
   - PropTypes validation
   - API contract validation

6. **Testing Coverage**:
   - Testability of code
   - Missing test cases
   - Edge cases coverage
   - Mock/stub usage
   - Integration test gaps

7. **Documentation**:
   - Code comments quality
   - Docstrings/JSDoc
   - API documentation
   - Complex logic explanation
   - TODO/FIXME items

8. **Maintainability**:
   - Code modularity
   - Coupling and cohesion
   - Dependency management
   - Configuration flexibility
   - Scalability considerations

9. **Code Style**:
   - Linting errors
   - Formatting consistency
   - Import organization
   - File structure

10. **Refactoring Suggestions**:
    - Code that needs refactoring
    - Architectural improvements
    - Better abstractions
    - Performance improvements
    - Simplification opportunities

Provide:
- List of issues (critical, major, minor)
- Specific recommendations with code examples
- Refactoring suggestions
- Quality score (1-10)
- Actionable improvement plan"""
        
        review_results = self.generate_code(prompt, {
            "platform": platform
        })
        
        self.log("Code review completed")
        
        return {
            "agent": self.name,
            "status": "completed",
            "review_results": review_results,
            "review_categories": [
                "Code Quality",
                "Best Practices",
                "Performance",
                "Security",
                "Type Safety",
                "Testing Coverage",
                "Documentation",
                "Maintainability"
            ],
            "quality_score": "TBD"
        }