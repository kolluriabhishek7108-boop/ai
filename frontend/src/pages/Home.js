import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { Loader2, Sparkles, Code, Smartphone, Monitor, Cpu } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requirements: '',
    app_type: 'web',
    target_platforms: ['react'],
    architecture_type: 'modular'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await projectsAPI.create(formData);
      const projectId = response.data.id;
      
      // Navigate to project details
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformToggle = (platform) => {
    setFormData(prev => {
      const platforms = prev.target_platforms.includes(platform)
        ? prev.target_platforms.filter(p => p !== platform)
        : [...prev.target_platforms, platform];
      return { ...prev, target_platforms: platforms };
    });
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 px-4 py-2 rounded-full mb-6">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-purple-300 text-sm font-medium">Advanced Multi-Agent System</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Build Production Apps
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            with AI Agents
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Beyond MVPs. Our 12 specialized AI agents work together to create complete,
          production-ready applications for web, mobile, and desktop.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
          <Code className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Modular Architecture</h3>
          <p className="text-gray-400">Professional backend structure with proper separation of concerns</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
          <Cpu className="w-12 h-12 text-pink-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">12 Specialized Agents</h3>
          <p className="text-gray-400">Each agent excels at their domain - from backend to security</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
          <Monitor className="w-12 h-12 text-blue-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Multi-Platform</h3>
          <p className="text-gray-400">Generate web, mobile, and desktop apps from a single prompt</p>
        </div>
      </div>

      {/* Project Creation Form */}
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-white mb-6">Create New Project</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/10 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="My Awesome App"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white/10 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="A brief description of your project"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Requirements</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              className="w-full bg-white/10 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-32"
              placeholder="Describe what you want to build... Be as detailed as possible!"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Application Type</label>
            <div className="grid grid-cols-4 gap-4">
              {['web', 'mobile', 'desktop', 'multi-platform'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({...formData, app_type: type})}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.app_type === type
                      ? 'bg-purple-500 border-purple-500 text-white'
                      : 'bg-white/5 border-purple-500/20 text-gray-300 hover:border-purple-500/40'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Target Platforms</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['react', 'nextjs', 'react-native', 'flutter', 'electron'].map(platform => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handlePlatformToggle(platform)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.target_platforms.includes(platform)
                      ? 'bg-purple-500 border-purple-500 text-white'
                      : 'bg-white/5 border-purple-500/20 text-gray-300 hover:border-purple-500/40'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Architecture Type</label>
            <select
              value={formData.architecture_type}
              onChange={(e) => setFormData({...formData, architecture_type: e.target.value})}
              className="w-full bg-white/10 border border-purple-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="modular">Modular (Recommended)</option>
              <option value="microservices">Microservices</option>
              <option value="monolithic">Monolithic</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Project...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Application</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
