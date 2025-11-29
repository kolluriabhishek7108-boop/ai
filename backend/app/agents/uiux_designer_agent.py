from app.agents.base_agent import BaseAgent
from typing import Dict, Any

class UIUXDesignerAgent(BaseAgent):
    """Agent specialized in UI/UX design and design systems"""
    
    def __init__(self, llm_provider: str = "emergent"):
        super().__init__("UIUX_Designer", llm_provider)
    
    def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Create comprehensive UI/UX design system"""
        self.log("Starting UI/UX design system creation")
        
        requirements = task.get("requirements", "")
        platform = task.get("platform", "web")
        design_style = task.get("design_style", "modern")
        
        prompt = f"""Create a comprehensive UI/UX design system for:

Requirements: {requirements}
Platform: {platform}
Design Style: {design_style}

Provide detailed specifications for:

1. **Color Palette**:
   - Primary, secondary, accent colors
   - Neutral shades
   - Semantic colors (success, error, warning, info)
   - Dark mode variants

2. **Typography**:
   - Font families (headings, body, monospace)
   - Font sizes and weights scale
   - Line heights and letter spacing
   - Responsive typography rules

3. **Spacing System**:
   - Base unit (4px, 8px grid)
   - Spacing scale (xs, sm, md, lg, xl, 2xl, etc.)
   - Padding and margin conventions

4. **Component Design**:
   - Buttons (primary, secondary, tertiary, sizes, states)
   - Input fields (text, textarea, select, checkbox, radio)
   - Cards and containers
   - Navigation (navbar, sidebar, tabs)
   - Modals and dialogs
   - Forms and validation states
   - Data tables
   - Loading states and skeletons

5. **Layout System**:
   - Grid system (12-column, etc.)
   - Breakpoints for responsiveness
   - Container widths
   - Page layouts (dashboard, auth, landing)

6. **Icons & Imagery**:
   - Icon system (outline, filled, sizes)
   - Image guidelines (aspect ratios, sizes)
   - Placeholder patterns

7. **Animation & Interactions**:
   - Transition durations
   - Easing functions
   - Hover states
   - Focus states
   - Loading animations

8. **Accessibility**:
   - ARIA labels strategy
   - Keyboard navigation
   - Screen reader support
   - Color contrast ratios

9. **Design Patterns**:
   - User flows
   - Common UI patterns
   - Error states
   - Empty states

Format as a complete design system with code examples (CSS/Tailwind)."""
        
        design_system = self.generate_code(prompt, {
            "platform": platform,
            "design_style": design_style
        })
        
        self.log("UI/UX design system completed")
        
        return {
            "agent": self.name,
            "status": "completed",
            "design_system": design_system,
            "platform": platform,
            "features": [
                "Complete Color Palette",
                "Typography Scale",
                "Spacing System",
                "Component Library",
                "Responsive Grid",
                "Accessibility Standards",
                "Animation Guidelines",
                "Dark Mode Support"
            ]
        }