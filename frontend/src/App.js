import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import '@/App.css';
import EnhancedHome from './pages/EnhancedHome';
import ProjectDashboard from './pages/ProjectDashboard';
import EnhancedProjectDetails from './pages/EnhancedProjectDetails';
import AgentWorkflow from './pages/AgentWorkflow';

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <BrowserRouter>
        {/* Navigation */}
        <nav className="bg-black/30 backdrop-blur-lg border-b border-purple-500/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="text-white font-bold text-xl">Agent Gen</span>
              </Link>
              <div className="flex space-x-6">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
                <Link to="/projects" className="text-gray-300 hover:text-white transition-colors">Projects</Link>
                <Link to="/workflow" className="text-gray-300 hover:text-white transition-colors">Agents</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectDashboard />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/workflow" element={<AgentWorkflow />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
