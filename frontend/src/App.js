import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import '@/App.css';
import EnhancedHome from './pages/EnhancedHome';
import ProjectDashboard from './pages/ProjectDashboard';
import EnhancedProjectDetails from './pages/EnhancedProjectDetails';
import AgentWorkflow from './pages/AgentWorkflow';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import TemplateLibrary from './pages/TemplateLibrary';
import Settings from './pages/Settings';
import { BarChart3, Layout, Settings as SettingsIcon, Home, FolderOpen, Users } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-black/30 backdrop-blur-lg border-b border-purple-500/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-white font-bold text-xl">Agent Gen</span>
          </Link>
          <div className="flex items-center space-x-1">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/') ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/projects" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/projects') ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Projects</span>
            </Link>
            <Link 
              to="/templates" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/templates') ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>Templates</span>
            </Link>
            <Link 
              to="/analytics" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/analytics') ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
            <Link 
              to="/workflow" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/workflow') ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Agents</span>
            </Link>
            <Link 
              to="/settings" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/settings') ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <BrowserRouter>
        {/* Navigation */}
        <Navigation />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<EnhancedHome />} />
          <Route path="/projects" element={<ProjectDashboard />} />
          <Route path="/projects/:id" element={<EnhancedProjectDetails />} />
          <Route path="/workflow" element={<AgentWorkflow />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/templates" element={<TemplateLibrary />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
