import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsAPI } from '../services/api';
import websocketService from '../services/websocket';
import { Loader2, Play, Download, FileCode, AlertCircle, RefreshCw, Code, Wifi, WifiOff, Eye } from 'lucide-react';
import AgentMonitor from '../components/AgentMonitor';
import CodePreview from '../components/CodePreview';
import LivePreview from '../components/LivePreview';

const EnhancedProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('monitor'); // monitor, code, logs
  const [wsConnected, setWsConnected] = useState(false);
  const [agentUpdates, setAgentUpdates] = useState([]);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data) => {
    console.log('Received WebSocket message:', data);

    switch (data.type) {
      case 'connection':
        console.log('✅ WebSocket connection established');
        break;

      case 'status_update':
        setProject(prev => prev ? { ...prev, status: data.status, progress: data.progress } : null);
        break;

      case 'agent_update':
        setAgentUpdates(prev => [...prev, {
          agent: data.agent,
          status: data.agent_status,
          message: data.message,
          timestamp: new Date().toISOString()
        }]);
        break;

      case 'log':
        setLogs(prev => [...prev, {
          timestamp: new Date().toISOString(),
          message: data.message,
          level: data.level
        }]);
        break;

      case 'completion':
        setProject(prev => prev ? {
          ...prev,
          status: data.success ? 'completed' : 'failed'
        } : null);
        if (data.success) {
          loadProject(); // Reload full project data
        }
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  }, []);

  // Load project data
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

  // Connect to WebSocket on mount
  useEffect(() => {
    loadProject();

    // Connect WebSocket
    websocketService.connect(
      id,
      handleWebSocketMessage,
      (error) => {
        console.error('WebSocket error:', error);
      },
      (connected) => {
        setWsConnected(connected);
      }
    );

    // Cleanup on unmount
    return () => {
      websocketService.disconnect();
    };
  }, [id, handleWebSocketMessage]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      await projectsAPI.generate(id);
      setActiveTab('monitor'); // Switch to monitor tab
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to start generation');
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError(null);
    try {
      await projectsAPI.regenerate(id);
      setActiveTab('monitor'); // Switch to monitor tab
      setLogs([]);
      loadProject();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to regenerate');
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      window.open(`${process.env.REACT_APP_BACKEND_URL}/api/projects/${id}/download`, '_blank');
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

  const currentAgent = logs.length > 0 ? Math.min(logs.length, 12) : 0;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">{project.name}</h1>
            {/* WebSocket Connection Status */}
            <div className="flex items-center space-x-2">
              {wsConnected ? (
                <>
                  <Wifi className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-green-400">Live Updates Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-400">Connecting...</span>
                </>
              )}
            </div>
          </div>
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
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              project.status === 'completed' ? 'bg-green-500/20 border border-green-500/30 text-green-300' :
              project.status === 'in_progress' ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300' :
              project.status === 'failed' ? 'bg-red-500/20 border border-red-500/30 text-red-300' :
              'bg-gray-500/20 border border-gray-500/30 text-gray-300'
            }`}>
              {project.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
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
            
            {(project.status === 'completed' || project.status === 'failed') && (
              <>
                <button
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold px-6 py-3 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  {regenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Regenerating...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      <span>Regenerate</span>
                    </>
                  )}
                </button>
                {project.status === 'completed' && (
                  <button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Code</span>
                  </button>
                )}
              </>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center space-x-2"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Overall Progress Bar */}
        {project.status === 'in_progress' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white">Generation Progress</h2>
              <span className="text-purple-300 font-bold text-lg">
                {project.progress || Math.round((currentAgent / 12) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all flex items-center justify-center"
                initial={{ width: '0%' }}
                animate={{ width: `${project.progress || Math.round((currentAgent / 12) * 100)}%` }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-white text-xs font-bold">
                  {project.progress || Math.round((currentAgent / 12) * 100)}%
                </span>
              </motion.div>
            </div>
            <p className="text-gray-400 text-sm text-center">
              {currentAgent} of 12 agents completed
            </p>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'monitor', label: 'Agent Monitor', icon: Loader2 },
            { key: 'code', label: 'Code Preview', icon: Code },
            { key: 'logs', label: 'Activity Logs', icon: FileCode }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'monitor' && (
            <AgentMonitor currentAgent={currentAgent} logs={logs} />
          )}

          {activeTab === 'code' && (
            <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
              <CodePreview projectName={project.name} />
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8">
              <div className="flex items-center space-x-2 mb-6">
                <FileCode className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Detailed Activity Logs</h2>
              </div>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-400">No activity yet. Start generation to see agent logs.</p>
                ) : (
                  logs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="bg-black/30 rounded-lg p-4 font-mono text-sm"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 text-purple-300 text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-300">
                            {typeof log === 'string' ? log : log.message || JSON.stringify(log)}
                          </p>
                          {log.timestamp && (
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8 mt-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Project Requirements</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{project.requirements}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedProjectDetails;