import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { Loader2, FolderOpen, Clock, CheckCircle2, XCircle } from 'lucide-react';

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'in_progress': return <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'failed': return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'in_progress': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Your Projects</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          Create New Project
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="w-24 h-24 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400">No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 hover:bg-white/10 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white truncate flex-1">{project.name}</h3>
                {getStatusIcon(project.status)}
              </div>
              
              <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>

              {project.status === 'in_progress' && (
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{project.progress || 0}% complete</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;
