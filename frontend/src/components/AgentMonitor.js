import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Clock, AlertCircle } from 'lucide-react';

const AgentMonitor = ({ agents, currentAgent, logs = [] }) => {
  // Default 12 agents if not provided
  const defaultAgents = [
    { id: 1, name: 'Database Designer', icon: '🗄️', status: 'idle' },
    { id: 2, name: 'API Architect', icon: '🔌', status: 'idle' },
    { id: 3, name: 'Backend Developer', icon: '⚙️', status: 'idle' },
    { id: 4, name: 'UI/UX Designer', icon: '🎨', status: 'idle' },
    { id: 5, name: 'Frontend Developer', icon: '💻', status: 'idle' },
    { id: 6, name: 'Image Generator', icon: '🖼️', status: 'idle' },
    { id: 7, name: 'Security Auditor', icon: '🔒', status: 'idle' },
    { id: 8, name: 'Performance Optimizer', icon: '⚡', status: 'idle' },
    { id: 9, name: 'Testing Engineer', icon: '🧪', status: 'idle' },
    { id: 10, name: 'DevOps Engineer', icon: '🐳', status: 'idle' },
    { id: 11, name: 'Documentation Writer', icon: '📝', status: 'idle' },
    { id: 12, name: 'Code Reviewer', icon: '✅', status: 'idle' }
  ];

  const agentsList = agents || defaultAgents;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'in_progress':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      case 'failed':
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      default:
        return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Progress Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentsList.map((agent, index) => {
          const isActive = currentAgent === agent.name || currentAgent === index + 1;
          const status = agent.status || (isActive ? 'in_progress' : index < (currentAgent || 0) ? 'completed' : 'idle');

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white/5 backdrop-blur-lg border rounded-xl p-4 transition-all ${
                isActive
                  ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'border-purple-500/20'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{agent.icon}</div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{agent.name}</h3>
                    <p className="text-gray-400 text-xs">Agent {agent.id}</p>
                  </div>
                </div>
                <div className={`p-1.5 rounded-lg border ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                </div>
              </div>
              
              {/* Progress Bar */}
              {status === 'in_progress' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Timeline View */}
      <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Agent Activity Timeline</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-400 text-sm">No activity yet. Agents will start working once generation begins.</p>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start space-x-3 bg-black/20 rounded-lg p-3"
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">
                    {typeof log === 'string' ? log : log.message || JSON.stringify(log)}
                  </p>
                  {log.timestamp && (
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-white">Overall Progress</h3>
          <span className="text-purple-300 font-bold">
            {Math.round(((currentAgent || 0) / agentsList.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full flex items-center justify-end pr-2"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentAgent || 0) / agentsList.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          >
            {currentAgent > 0 && (
              <span className="text-white text-xs font-bold">
                {currentAgent}/{agentsList.length}
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AgentMonitor;