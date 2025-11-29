import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsAPI, agentsAPI } from '../services/api';
import { Loader2, Sparkles, Code, Smartphone, Monitor, Cpu, Lightbulb, ChevronRight } from 'lucide-react';

const EnhancedHome = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requirements: '',
    app_type: 'web',
    target_platforms: ['react'],
    architecture_type: 'modular',
    database: 'mongodb',
    auth: false,
    deployment: 'docker'
  });
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!formData.requirements) {
      setError('Please describe your requirements first');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const response = await agentsAPI.analyze(formData.requirements);
      setAiSuggestions(response.data);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze requirements');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await projectsAPI.create(formData);
      const projectId = response.data.id;
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
    <div className="min-h-screen">
      {/* Hero Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-purple-500/10 px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Advanced Multi-Agent System</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Build Production Apps
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              with AI Agents
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Beyond MVPs. Our 12 specialized AI agents work together to create complete,
            production-ready applications for web, mobile, and desktop.
          </motion.p>
        </div>

        {/* Features Grid with Animation */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Code, title: 'Modular Architecture', desc: 'Professional backend structure with proper separation of concerns', color: 'purple' },
            { icon: Cpu, title: '12 Specialized Agents', desc: 'Each agent excels at their domain - from backend to security', color: 'pink' },
            { icon: Monitor, title: 'Multi-Platform', desc: 'Generate web, mobile, and desktop apps from a single prompt', color: 'blue' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 hover:bg-white/10 transition-all"
            >
              <feature.icon className={`w-12 h-12 text-${feature.color}-400 mb-4`} />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Project Creation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8"
        >
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 ${
                      step > s ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            {step === 1 && 'Describe Your Project'}
            {step === 2 && 'AI-Powered Recommendations'}
            {step === 3 && 'Configure & Create'}
          </h2>
          <p className="text-gray-400 text-center mb-6">
            {step === 1 && 'Tell us what you want to build'}
            {step === 2 && 'Review AI suggestions based on your requirements'}
            {step === 3 && 'Finalize your project configuration'}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6"
            >
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-white font-medium mb-2">Project Name *</label>
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
                <label className="block text-white font-medium mb-2">Short Description *</label>
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
                <label className="block text-white font-medium mb-2">Detailed Requirements *</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  className="w-full bg-white/10 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-40"
                  placeholder="Describe in detail what you want to build...\n\nExample:\n- User authentication with email/password\n- Dashboard with analytics charts\n- CRUD operations for managing items\n- Real-time notifications\n- Mobile-responsive design"
                  required
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={analyzing || !formData.name || !formData.requirements}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-5 h-5" />
                    <span>Get AI Recommendations</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Step 2: AI Suggestions */}
          {step === 2 && aiSuggestions && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">AI Analysis Complete!</h3>
                </div>
                <p className="text-gray-300 mb-4">{aiSuggestions.analysis || 'Based on your requirements, here are our recommendations:'}</p>
                
                {aiSuggestions.workflow && (
                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Suggested Workflow ({aiSuggestions.workflow.length} agents):</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {aiSuggestions.workflow.map((agent, index) => (
                        <div key={index} className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
                          {index + 1}. {agent}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-all"
                >
                  Back to Edit
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Continue to Configuration</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Advanced Configuration */}
          {step === 3 && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
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
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Architecture</label>
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

                <div>
                  <label className="block text-white font-medium mb-2">Database</label>
                  <select
                    value={formData.database}
                    onChange={(e) => setFormData({...formData, database: e.target.value})}
                    className="w-full bg-white/10 border border-purple-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="mongodb">MongoDB</option>
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="sqlite">SQLite</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auth"
                  checked={formData.auth}
                  onChange={(e) => setFormData({...formData, auth: e.target.checked})}
                  className="w-5 h-5 bg-white/10 border border-purple-500/20 rounded"
                />
                <label htmlFor="auth" className="text-white">Include Authentication System</label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-700 text-white font-bold py-4 rounded-lg hover:bg-gray-600 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
              </div>
            </motion.form>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EnhancedHome;