import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { Loader2, Play, Download, FileCode, AlertCircle } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadProject();
    const interval = setInterval(checkStatus, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await projectsAPI.getById(id);
      setProject(response.data);
      setLogs(response.data.agent_logs || []);
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const response = await projectsAPI.getStatus(id);
      if (response.data.logs) {
        setLogs(response.data.logs);
      }
      // Reload full project if status changed
      if (project && response.data.status !== project.status) {
        loadProject();
      }
    } catch (err) {
      // Silent fail for polling
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      await projectsAPI.generate(id);
      // Start polling for updates
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to start generation');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await projectsAPI.getCode(id);
      const blob = new Blob([JSON.stringify(response.data.code, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name}-code.json`;
      a.click();
    } catch (err) {
      setError('Failed to download code');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-300">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Project Header */}
        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-white mb-4">{project.name}</h1>
          <p className="text-gray-300 mb-6">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">
              {project.app_type}
            </span>
            {project.target_platforms.map(platform => (
              <span key={platform} className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">
                {platform}
              </span>
            ))}
            <span className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-pink-300 text-sm">
              {project.architecture_type}
            </span>
          </div>

          <div className="flex space-x-4">
            {project.status === 'pending' && (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Starting...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Start Generation</span>
                  </>
                )}
              </button>
            )}
            
            {project.status === 'completed' && (
              <button
                onClick={handleDownload}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Code</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Progress Section */}
        {project.status === 'in_progress' && (
          <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Generation Progress</h2>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all flex items-center justify-center"
                style={{ width: `${project.progress || 0}%` }}
              >
                <span className="text-white text-xs font-bold">{project.progress || 0}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Agent Logs */}
        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8">
          <div className="flex items-center space-x-2 mb-6">
            <FileCode className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Agent Activity</h2>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-400">No activity yet. Start generation to see agent logs.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-3 text-gray-300 font-mono text-sm">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8 mt-6">
          <h2 className="text-2xl font-bold text-white mb-4">Requirements</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{project.requirements}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
