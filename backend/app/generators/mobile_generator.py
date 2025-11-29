"""
Mobile Platform Generator - Generates React Native applications
"""
from typing import Dict, Any
from .base_generator import BaseGenerator


class MobileGenerator(BaseGenerator):
    """Generator for mobile applications (React Native)"""
    
    def generate_structure(self) -> Dict[str, Any]:
        """Generate React Native application structure"""
        return {
            "mobile": {
                "src": {
                    "components": {},
                    "screens": {},
                    "App.tsx": None
                },
                "package.json": None
            }
        }
    
    def generate_files(self) -> Dict[str, str]:
        """Generate all mobile application files"""
        files = {}
        
        files["mobile/package.json"] = self.create_package_json(
            dependencies={
                "react": "^18.2.0",
                "react-native": "^0.73.0"
            },
            dev_dependencies={
                "typescript": "^5.3.0"
            },
            scripts={
                "android": "react-native run-android",
                "ios": "react-native run-ios"
            }
        )
        
        project_name = self.project_config.get("name", "My App")
        files["mobile/src/App.tsx"] = f"""import React from 'react';
import {{ View, Text }} from 'react-native';

function App() {{
  return (
    <View>
      <Text>{project_name}</Text>
    </View>
  );
}}

export default App;
"""
        
        files["README.md"] = self.create_readme()
        
        return files
