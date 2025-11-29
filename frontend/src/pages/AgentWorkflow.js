import React, { useState, useEffect } from 'react';
import { agentsAPI } from '../services/api';
import { Cpu, Database, Code, Palette, Shield, TestTube, FileText, GitBranch, Image, Zap, Eye } from 'lucide-react';

const AgentWorkflow = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const response = await agentsAPI.getTypes();
      setAgents(response.data.agents);
    } catch (err) {
      console.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const getAgentIcon = (type) => {
    const icons = {
      backend: <Code className="w-8 h-8" />,
      frontend: <Palette className="w-8 h-8" />,
      database: <Database className="w-8 h-8" />,
      api_architect: <GitBranch className="w-8 h-8" />,
      uiux: <Eye className="w-8 h-8" />,
      devops: <Zap className="w-8 h-8" />,
      testing: <TestTube className="w-8 h-8" />,
      security: <Shield className="w-8 h-8" />,
      performance: <Cpu className="w-8 h-8" />,
      docs: <FileText className="w-8 h-8" />,
      code_review: <Eye className="w-8 h-8" />,
      image_gen: <Image className="w-8 h-8" />,
    };
    return icons[type] || <Cpu className="w-8 h-8" />;
  };

  const getAgentColor = (index) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-yellow-500 to-orange-500',
      'from-indigo-500 to-purple-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">AI Agent Workflow</h1>
        <p className="text-xl text-gray-300">
          Meet our team of 12 specialized AI agents working together
        </p>
      </div>

      {/* Workflow Diagram */}
      <div className="mb-16">
        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Development Pipeline</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-bold">
              Requirements
            </div>
            <div className="text-purple-400 text-2xl">→</div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-bold">
              Database Design
            </div>
            <div className="text-purple-400 text-2xl">→</div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-bold">
              Backend
            </div>
            <div className="text-purple-400 text-2xl">→</div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-bold">
              Frontend
            </div>
            <div className="text-purple-400 text-2xl">→</div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-bold">
              Testing
            </div>
            <div className="text-purple-400 text-2xl">→</div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-bold">
              Deployment
            </div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent, index) => (
          <div
            key={agent.type}
            className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 hover:bg-white/10 transition-all"
          >
            <div className={`w-16 h-16 bg-gradient-to-r ${getAgentColor(index)} rounded-xl flex items-center justify-center text-white mb-4`}>
              {getAgentIcon(agent.type)}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
            <p className="text-gray-400 text-sm">{agent.description}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="mt-16 bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-white mb-6">How It Works</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">You Describe Your Idea</h3>
              <p className="text-gray-300">
                Simply tell us what you want to build. Our AI agents analyze your requirements
                and break them down into actionable tasks.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Agents Collaborate</h3>
              <p className="text-gray-300">
                Each specialized agent works on their domain - database design, backend architecture,
                frontend development, testing, security, and more.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Production-Ready Code</h3>
              <p className="text-gray-300">
                Get complete, well-structured, production-ready code for web, mobile, or desktop.
                Not just an MVP - a complete application ready to deploy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentWorkflow;
