#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Advanced Multi-Agent Application Generator - Phase 2
Tests all 12 agents API endpoints, projects API, requirements analysis, and service health
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"❌ Error reading frontend .env: {e}")
        return "http://localhost:8001"
    
    return "http://localhost:8001"

BACKEND_URL = get_backend_url()
API_BASE = f"{BACKEND_URL}/api"

print(f"🔍 Testing Backend URL: {BACKEND_URL}")
print(f"🔍 API Base URL: {API_BASE}")
print("=" * 80)

class BackendTester:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
        
    def test_service_health(self):
        """Test basic service health and connectivity"""
        print("\n🏥 TESTING SERVICE HEALTH")
        print("-" * 40)
        
        # Test root endpoint
        try:
            response = requests.get(f"{API_BASE}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Root endpoint: {data.get('message', 'OK')}")
                print(f"   Version: {data.get('version', 'Unknown')}")
                self.passed += 1
            else:
                print(f"❌ Root endpoint failed: {response.status_code}")
                self.failed += 1
                self.errors.append(f"Root endpoint returned {response.status_code}")
        except Exception as e:
            print(f"❌ Root endpoint error: {e}")
            self.failed += 1
            self.errors.append(f"Root endpoint connection error: {e}")
        
        # Test health endpoint
        try:
            response = requests.get(f"{API_BASE}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health check: {data.get('status', 'OK')}")
                self.passed += 1
            else:
                print(f"❌ Health check failed: {response.status_code}")
                self.failed += 1
                self.errors.append(f"Health check returned {response.status_code}")
        except Exception as e:
            print(f"❌ Health check error: {e}")
            self.failed += 1
            self.errors.append(f"Health check connection error: {e}")
    
    def test_agents_endpoint(self):
        """Test GET /api/agents/types - verify all 12 agents"""
        print("\n🤖 TESTING AGENTS ENDPOINT")
        print("-" * 40)
        
        try:
            response = requests.get(f"{API_BASE}/agents/types", timeout=15)
            
            if response.status_code != 200:
                print(f"❌ Agents endpoint failed: {response.status_code}")
                print(f"   Response: {response.text}")
                self.failed += 1
                self.errors.append(f"Agents endpoint returned {response.status_code}")
                return
            
            data = response.json()
            
            # Check total agents count
            total_agents = data.get('total_agents', 0)
            if total_agents == 12:
                print(f"✅ Total agents count: {total_agents}")
                self.passed += 1
            else:
                print(f"❌ Expected 12 agents, got {total_agents}")
                self.failed += 1
                self.errors.append(f"Expected 12 agents, got {total_agents}")
            
            # Check agents array
            agents = data.get('agents', [])
            if len(agents) == 12:
                print(f"✅ Agents array length: {len(agents)}")
                self.passed += 1
            else:
                print(f"❌ Expected 12 agents in array, got {len(agents)}")
                self.failed += 1
                self.errors.append(f"Expected 12 agents in array, got {len(agents)}")
            
            # Verify each agent has required fields
            required_fields = ['id', 'type', 'name', 'icon', 'description', 'capabilities', 'output']
            expected_agents = [
                'Database Designer', 'API Architect', 'Backend Developer', 'UI/UX Designer',
                'Frontend Developer', 'Image Generator', 'Security Auditor', 'Performance Optimizer',
                'Testing Engineer', 'DevOps Engineer', 'Documentation Writer', 'Code Reviewer'
            ]
            
            found_agents = []
            for i, agent in enumerate(agents):
                agent_name = agent.get('name', f'Agent {i+1}')
                found_agents.append(agent_name)
                
                # Check required fields
                missing_fields = [field for field in required_fields if field not in agent]
                if not missing_fields:
                    print(f"✅ {agent_name}: All required fields present")
                    self.passed += 1
                else:
                    print(f"❌ {agent_name}: Missing fields: {missing_fields}")
                    self.failed += 1
                    self.errors.append(f"{agent_name} missing fields: {missing_fields}")
                
                # Check capabilities is a list
                if isinstance(agent.get('capabilities'), list):
                    print(f"   📋 Capabilities: {len(agent['capabilities'])} items")
                else:
                    print(f"❌ {agent_name}: Capabilities should be a list")
                    self.failed += 1
                    self.errors.append(f"{agent_name} capabilities not a list")
            
            # Check if all expected agents are present
            missing_agents = [agent for agent in expected_agents if agent not in found_agents]
            if not missing_agents:
                print(f"✅ All 12 expected agents found")
                self.passed += 1
            else:
                print(f"❌ Missing agents: {missing_agents}")
                self.failed += 1
                self.errors.append(f"Missing agents: {missing_agents}")
            
            # Check workflow information
            workflow = data.get('workflow', [])
            if workflow:
                print(f"✅ Workflow information present: {len(workflow)} stages")
                self.passed += 1
            else:
                print(f"❌ Workflow information missing")
                self.failed += 1
                self.errors.append("Workflow information missing")
                
        except Exception as e:
            print(f"❌ Agents endpoint error: {e}")
            self.failed += 1
            self.errors.append(f"Agents endpoint error: {e}")
    
    def test_projects_endpoints(self):
        """Test projects API endpoints"""
        print("\n📁 TESTING PROJECTS ENDPOINTS")
        print("-" * 40)
        
        # Test GET /api/projects (should return empty array initially)
        try:
            response = requests.get(f"{API_BASE}/projects", timeout=10)
            if response.status_code == 200:
                projects = response.json()
                print(f"✅ GET /projects: {len(projects)} projects found")
                self.passed += 1
            else:
                print(f"❌ GET /projects failed: {response.status_code}")
                print(f"   Response: {response.text}")
                self.failed += 1
                self.errors.append(f"GET /projects returned {response.status_code}")
        except Exception as e:
            print(f"❌ GET /projects error: {e}")
            self.failed += 1
            self.errors.append(f"GET /projects error: {e}")
        
        # Test POST /api/projects (create a test project)
        test_project = {
            "name": "Test E-commerce Platform",
            "description": "A comprehensive e-commerce platform with user management, product catalog, shopping cart, and payment processing",
            "requirements": "Build a modern e-commerce platform with React frontend, FastAPI backend, MongoDB database, user authentication, product management, shopping cart, payment integration with Stripe, order management, and admin dashboard",
            "app_type": "web",
            "target_platforms": ["react", "nextjs"],
            "architecture_type": "modular"
        }
        
        try:
            response = requests.post(
                f"{API_BASE}/projects", 
                json=test_project,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                project_data = response.json()
                project_id = project_data.get('id')
                print(f"✅ POST /projects: Project created with ID {project_id}")
                print(f"   Name: {project_data.get('name')}")
                print(f"   Status: {project_data.get('status')}")
                self.passed += 1
                
                # Test GET specific project
                try:
                    get_response = requests.get(f"{API_BASE}/projects/{project_id}", timeout=10)
                    if get_response.status_code == 200:
                        retrieved_project = get_response.json()
                        print(f"✅ GET /projects/{project_id}: Project retrieved successfully")
                        self.passed += 1
                    else:
                        print(f"❌ GET /projects/{project_id} failed: {get_response.status_code}")
                        self.failed += 1
                        self.errors.append(f"GET specific project returned {get_response.status_code}")
                except Exception as e:
                    print(f"❌ GET specific project error: {e}")
                    self.failed += 1
                    self.errors.append(f"GET specific project error: {e}")
                
            else:
                print(f"❌ POST /projects failed: {response.status_code}")
                print(f"   Response: {response.text}")
                self.failed += 1
                self.errors.append(f"POST /projects returned {response.status_code}")
                
        except Exception as e:
            print(f"❌ POST /projects error: {e}")
            self.failed += 1
            self.errors.append(f"POST /projects error: {e}")
    
    def test_requirements_analysis(self):
        """Test POST /api/agents/analyze - requirements analysis"""
        print("\n🔍 TESTING REQUIREMENTS ANALYSIS")
        print("-" * 40)
        
        test_requirements = {
            "text": "I want to build a social media platform where users can create profiles, post content, follow other users, like and comment on posts, and receive real-time notifications. The platform should have a mobile app and web interface, with features like image/video sharing, direct messaging, and content moderation."
        }
        
        try:
            response = requests.post(
                f"{API_BASE}/agents/analyze",
                json=test_requirements,
                headers={"Content-Type": "application/json"},
                timeout=20
            )
            
            if response.status_code == 200:
                analysis = response.json()
                print(f"✅ Requirements analysis successful")
                
                # Check if analysis contains expected fields
                expected_fields = ['suggested_workflow']
                found_fields = []
                
                for field in expected_fields:
                    if field in analysis:
                        found_fields.append(field)
                        print(f"   📋 {field}: Present")
                
                if 'suggested_workflow' in analysis:
                    workflow = analysis['suggested_workflow']
                    if isinstance(workflow, list) and len(workflow) > 0:
                        print(f"   🔄 Workflow steps: {len(workflow)}")
                        self.passed += 1
                    else:
                        print(f"❌ Workflow should be a non-empty list")
                        self.failed += 1
                        self.errors.append("Workflow should be a non-empty list")
                else:
                    print(f"❌ Missing suggested_workflow in analysis")
                    self.failed += 1
                    self.errors.append("Missing suggested_workflow in analysis")
                
                self.passed += 1
                
            else:
                print(f"❌ Requirements analysis failed: {response.status_code}")
                print(f"   Response: {response.text}")
                self.failed += 1
                self.errors.append(f"Requirements analysis returned {response.status_code}")
                
        except Exception as e:
            print(f"❌ Requirements analysis error: {e}")
            self.failed += 1
            self.errors.append(f"Requirements analysis error: {e}")
    
    def test_agent_imports(self):
        """Test that all agent modules can be imported without errors"""
        print("\n📦 TESTING AGENT IMPORTS")
        print("-" * 40)
        
        # This is tested indirectly by checking if the agents endpoint works
        # If all 12 agents are returned, it means imports are working
        try:
            response = requests.get(f"{API_BASE}/agents/types", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('total_agents') == 12 and len(data.get('agents', [])) == 12:
                    print("✅ All agent imports working (verified via API response)")
                    self.passed += 1
                else:
                    print("❌ Agent imports may have issues (incomplete agent list)")
                    self.failed += 1
                    self.errors.append("Agent imports may have issues")
            else:
                print("❌ Cannot verify agent imports (API endpoint failed)")
                self.failed += 1
                self.errors.append("Cannot verify agent imports")
        except Exception as e:
            print(f"❌ Agent imports test error: {e}")
            self.failed += 1
            self.errors.append(f"Agent imports test error: {e}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 STARTING COMPREHENSIVE BACKEND TESTING")
        print(f"📅 Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)
        
        self.test_service_health()
        self.test_agents_endpoint()
        self.test_projects_endpoints()
        self.test_requirements_analysis()
        self.test_agent_imports()
        
        # Print summary
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        print(f"✅ Passed: {self.passed}")
        print(f"❌ Failed: {self.failed}")
        print(f"📈 Success Rate: {(self.passed / (self.passed + self.failed) * 100):.1f}%" if (self.passed + self.failed) > 0 else "0%")
        
        if self.errors:
            print(f"\n🚨 ERRORS FOUND:")
            for i, error in enumerate(self.errors, 1):
                print(f"   {i}. {error}")
        
        print("\n" + "=" * 80)
        
        return self.failed == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    if success:
        print("🎉 ALL TESTS PASSED!")
        sys.exit(0)
    else:
        print("💥 SOME TESTS FAILED!")
        sys.exit(1)