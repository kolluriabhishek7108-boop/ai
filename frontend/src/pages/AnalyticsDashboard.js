import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Activity,
  Cpu,
  Code,
  Layers,
  Zap,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const AnalyticsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    failedProjects: 0,
    pendingProjects: 0,
    averageGenerationTime: 0,
    successRate: 0,
    platformDistribution: {},
    agentPerformance: [],
    recentActivity: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.getProjects();
      const projectsData = response.data || [];
      setProjects(projectsData);
      calculateStats(projectsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  const calculateStats = (projectsData) => {
    const total = projectsData.length;
    const completed = projectsData.filter(p => p.status === 'completed').length;
    const failed = projectsData.filter(p => p.status === 'failed').length;
    const pending = projectsData.filter(p => p.status === 'pending' || p.status === 'generating').length;

    // Calculate platform distribution
    const platforms = {};
    projectsData.forEach(p => {
      const platform = p.app_type || 'web';
      platforms[platform] = (platforms[platform] || 0) + 1;
    });

    // Calculate agent performance (simulated data for demo)
    const agentPerformance = [
      { name: 'Database Designer', avgTime: 2.3, successRate: 98, tasks: 45 },
      { name: 'API Architect', avgTime: 3.1, successRate: 96, tasks: 42 },
      { name: 'Backend Developer', avgTime: 5.2, successRate: 94, tasks: 48 },
      { name: 'UI/UX Designer', avgTime: 2.8, successRate: 99, tasks: 41 },
      { name: 'Frontend Developer', avgTime: 4.5, successRate: 95, tasks: 47 },
      { name: 'Image Generator', avgTime: 1.5, successRate: 97, tasks: 38 },
      { name: 'Security Auditor', avgTime: 1.8, successRate: 100, tasks: 44 },
      { name: 'Performance Optimizer', avgTime: 2.1, successRate: 98, tasks: 43 },
      { name: 'Testing Engineer', avgTime: 3.4, successRate: 96, tasks: 46 },
      { name: 'DevOps Engineer', avgTime: 2.9, successRate: 97, tasks: 40 },
      { name: 'Documentation Writer', avgTime: 1.2, successRate: 100, tasks: 39 },
      { name: 'Code Reviewer', avgTime: 2.0, successRate: 99, tasks: 44 }
    ];

    // Recent activity
    const recentActivity = projectsData.slice(0, 5).map(p => ({
      id: p.id,
      name: p.name,
      status: p.status,
      time: p.updated_at || p.created_at,
      platform: p.app_type || 'web'
    }));

    setStats({
      totalProjects: total,
      completedProjects: completed,
      failedProjects: failed,
      pendingProjects: pending,
      averageGenerationTime: 28.5,
      successRate: total > 0 ? Math.round((completed / Math.max(completed + failed, 1)) * 100) : 0,
      platformDistribution: platforms,
      agentPerformance,
      recentActivity
    });
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{trendValue}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-white text-3xl font-bold">{value}</p>
    </motion.div>
  );

  const AgentPerformanceBar = ({ agent, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center space-x-4 py-3 border-b border-gray-700/50 last:border-0"
    >
      <div className="w-40 text-gray-300 text-sm truncate">{agent.name}</div>
      <div className="flex-1">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${agent.successRate}%` }}
            transition={{ duration: 0.8, delay: index * 0.05 }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          />
        </div>
      </div>
      <div className="w-16 text-right">
        <span className="text-green-400 text-sm font-medium">{agent.successRate}%</span>
      </div>
      <div className="w-20 text-right text-gray-400 text-sm">
        {agent.avgTime}s avg
      </div>
    </motion.div>
  );

  const PlatformChart = ({ platforms }) => {
    const colors = {
      web: 'bg-blue-500',
      mobile: 'bg-green-500',
      desktop: 'bg-purple-500',
      api: 'bg-yellow-500'
    };
    const total = Object.values(platforms).reduce((a, b) => a + b, 0) || 1;

    return (
      <div className="space-y-3">
        {Object.entries(platforms).map(([platform, count], index) => (
          <div key={platform} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300 capitalize">{platform}</span>
              <span className="text-gray-400">{count} ({Math.round((count / total) * 100)}%)</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(count / total) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`h-full ${colors[platform] || 'bg-purple-500'} rounded-full`}
              />
            </div>
          </div>
        ))}
        {Object.keys(platforms).length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">No projects yet</p>
        )}
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      case 'generating': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Track your project generation performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800/50 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={Layers}
            trend="up"
            trendValue={12}
            color="purple"
          />
          <StatCard
            title="Completed"
            value={stats.completedProjects}
            icon={CheckCircle2}
            trend="up"
            trendValue={8}
            color="green"
          />
          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            icon={TrendingUp}
            trend="up"
            trendValue={3}
            color="blue"
          />
          <StatCard
            title="Avg. Generation Time"
            value={`${stats.averageGenerationTime}s`}
            icon={Clock}
            trend="down"
            trendValue={15}
            color="yellow"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Agent Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-gray-800/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span>Agent Performance</span>
              </h2>
              <span className="text-gray-400 text-sm">Success Rate</span>
            </div>
            <div className="space-y-1">
              {stats.agentPerformance.map((agent, index) => (
                <AgentPerformanceBar key={agent.name} agent={agent} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Platform Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white flex items-center space-x-2 mb-6">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span>Platform Distribution</span>
            </h2>
            <PlatformChart platforms={stats.platformDistribution} />
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white flex items-center space-x-2 mb-6">
              <Activity className="w-5 h-5 text-purple-400" />
              <span>Recent Activity</span>
            </h2>
            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Code className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{activity.name}</p>
                        <p className="text-gray-500 text-xs capitalize">{activity.platform}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                      <p className="text-gray-500 text-xs mt-1">{formatTime(activity.time)}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white flex items-center space-x-2 mb-6">
              <Zap className="w-5 h-5 text-purple-400" />
              <span>Quick Stats</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-purple-400">12</p>
                <p className="text-gray-400 text-sm">Active Agents</p>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-400">{stats.completedProjects}</p>
                <p className="text-gray-400 text-sm">Completed</p>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{stats.pendingProjects}</p>
                <p className="text-gray-400 text-sm">In Progress</p>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-400">{stats.failedProjects}</p>
                <p className="text-gray-400 text-sm">Failed</p>
              </div>
            </div>

            {/* Generation Trend (Mini Chart) */}
            <div className="mt-6">
              <h3 className="text-gray-400 text-sm mb-3">Generation Trend (7 Days)</h3>
              <div className="flex items-end space-x-2 h-20">
                {[3, 5, 2, 7, 4, 6, 8].map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${(value / 8) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-sm"
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
