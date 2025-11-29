import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  FileText, 
  LayoutDashboard, 
  Users, 
  MessageSquare,
  Briefcase,
  GraduationCap,
  Heart,
  Camera,
  Music,
  Utensils,
  Plane,
  Search,
  Star,
  Clock,
  Code,
  Zap,
  ArrowRight,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const templates = [
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Full-featured online store with product catalog, cart, checkout, and payment integration',
    icon: ShoppingCart,
    category: 'Business',
    difficulty: 'Advanced',
    estimatedTime: '45 min',
    features: ['Product Catalog', 'Shopping Cart', 'User Auth', 'Payment Gateway', 'Order Management', 'Admin Dashboard'],
    platforms: ['web', 'mobile'],
    color: 'from-green-500 to-emerald-600',
    popular: true,
    config: {
      name: 'E-commerce Store',
      description: 'A full-featured e-commerce platform with product management, shopping cart, and payment processing',
      requirements: 'Build an e-commerce store with product listings, categories, search, shopping cart, user authentication, checkout with payment gateway integration, order tracking, and admin dashboard',
      platforms: ['web'],
      architecture_style: 'modular'
    }
  },
  {
    id: 'blog',
    name: 'Blog Platform',
    description: 'Content management system with rich text editor, categories, and SEO optimization',
    icon: FileText,
    category: 'Content',
    difficulty: 'Beginner',
    estimatedTime: '25 min',
    features: ['Rich Text Editor', 'Categories', 'Comments', 'SEO Optimization', 'User Profiles', 'RSS Feed'],
    platforms: ['web'],
    color: 'from-blue-500 to-cyan-600',
    popular: true,
    config: {
      name: 'Blog Platform',
      description: 'A modern blog platform with rich content editing and management',
      requirements: 'Create a blog platform with rich text editor, post categories and tags, comment system, user profiles, SEO optimization, and RSS feed generation',
      platforms: ['web'],
      architecture_style: 'modular'
    }
  },
  {
    id: 'dashboard',
    name: 'Admin Dashboard',
    description: 'Analytics dashboard with charts, data tables, and real-time monitoring',
    icon: LayoutDashboard,
    category: 'Business',
    difficulty: 'Intermediate',
    estimatedTime: '35 min',
    features: ['Interactive Charts', 'Data Tables', 'Real-time Updates', 'User Management', 'Reports Export', 'Notifications'],
    platforms: ['web'],
    color: 'from-purple-500 to-violet-600',
    popular: true,
    config: {
      name: 'Admin Dashboard',
      description: 'A comprehensive admin dashboard for business analytics and management',
      requirements: 'Build an admin dashboard with interactive charts, data visualization, real-time updates, user management, role-based access control, and report generation',
      platforms: ['web'],
      architecture_style: 'modular'
    }
  },
  {
    id: 'social',
    name: 'Social Network',
    description: 'Social media platform with posts, follows, likes, and real-time messaging',
    icon: Users,
    category: 'Social',
    difficulty: 'Advanced',
    estimatedTime: '50 min',
    features: ['User Profiles', 'Posts & Feed', 'Follow System', 'Likes & Comments', 'Messaging', 'Notifications'],
    platforms: ['web', 'mobile'],
    color: 'from-pink-500 to-rose-600',
    config: {
      name: 'Social Network',
      description: 'A social networking platform for connecting people',
      requirements: 'Create a social network with user profiles, post creation with media support, follow/unfollow system, likes and comments, real-time messaging, and push notifications',
      platforms: ['web', 'mobile'],
      architecture_style: 'modular'
    }
  },
  {
    id: 'chat',
    name: 'Chat Application',
    description: 'Real-time messaging app with channels, direct messages, and file sharing',
    icon: MessageSquare,
    category: 'Communication',
    difficulty: 'Intermediate',
    estimatedTime: '35 min',
    features: ['Real-time Chat', 'Channels', 'Direct Messages', 'File Sharing', 'Online Status', 'Message Search'],
    platforms: ['web', 'mobile', 'desktop'],
    color: 'from-indigo-500 to-blue-600',
    config: {
      name: 'Chat Application',
      description: 'A real-time chat application for team communication',
      requirements: 'Build a chat app with real-time messaging, channels, direct messages, file sharing, online status indicators, message search, and notification system',
      platforms: ['web', 'mobile', 'desktop'],
      architecture_style: 'modular'
    }
  },
  {
    id: 'portfolio',
    name: 'Portfolio Website',
    description: 'Personal portfolio with projects showcase, blog, and contact form',
    icon: Briefcase,
    category: 'Personal',
    difficulty: 'Beginner',
    estimatedTime: '20 min',
    features: ['Project Gallery', 'About Section', 'Contact Form', 'Resume Download', 'Blog Integration', 'Dark Mode'],
    platforms: ['web'],
    color: 'from-amber-500 to-orange-600',
    config: {
      name: 'Portfolio Website',
      description: 'A professional portfolio website to showcase your work',
      requirements: 'Create a portfolio website with project gallery, about section, skills showcase, contact form, resume download, and optional blog integration',
      platforms: ['web'],
      architecture_style: 'simple'
    }
  },
  {
    id: 'lms',
    name: 'Learning Platform',
    description: 'Online learning management system with courses, quizzes, and progress tracking',
    icon: GraduationCap,
    category: 'Education',
    difficulty: 'Advanced',
    estimatedTime: '55 min',
    features: ['Course Management', 'Video Lessons', 'Quizzes', 'Progress Tracking', 'Certificates', 'Discussion Forums'],
    platforms: ['web', 'mobile'],
    color: 'from-teal-500 to-green-600',
    config: {
      name: 'Learning Platform',
      description: 'An online learning management system for courses and education',
      requirements: 'Build an LMS with course creation, video lessons, interactive quizzes, student progress tracking, certificate generation, and discussion forums',
      platforms: ['web', 'mobile'],
      architecture_style: 'modular'
    }
  },
  {
    id: 'healthcare',
    name: 'Healthcare App',
    description: 'Medical appointment booking with doctor profiles and health records',
    icon: Heart,
    category: 'Healthcare',
    difficulty: 'Advanced',
    estimatedTime: '50 min',
    features: ['Doctor Profiles', 'Appointment Booking', 'Health Records', 'Prescriptions', 'Video Consultations', 'Reminders'],
    platforms: ['web', 'mobile'],
    color: 'from-red-500 to-pink-600',
    config: {
      name: 'Healthcare App',
      description: 'A healthcare management application for patients and doctors',
      requirements: 'Create a healthcare app with doctor profiles, appointment booking, medical records management, prescription tracking, video consultations, and medication reminders',
      platforms: ['web', 'mobile'],
      architecture_style: 'modular'
    }
  },
  {
    id: 'photo-gallery',
    name: 'Photo Gallery',
    description: 'Image gallery with albums, tags, and advanced image editing',
    icon: Camera,
    category: 'Media',
    difficulty: 'Intermediate',
    estimatedTime: '30 min',
    features: ['Album Management', 'Image Upload', 'Tags & Search', 'Slideshow', 'Image Editing', 'Sharing'],
    platforms: ['web', 'mobile'],
    color: 'from-fuchsia-500 to-purple-600',
    config: {
      name: 'Photo Gallery',
      description: 'A photo gallery application for organizing and sharing images',
      requirements: 'Build a photo gallery with album management, image upload with progress, tags and search, slideshow view, basic image editing, and social sharing',
      platforms: ['web', 'mobile'],
      architecture_style: 'modular'
    }
  },
  {
    id: 'music-player',
    name: 'Music Streaming',
    description: 'Music streaming app with playlists, recommendations, and offline mode',
    icon: Music,
    category: 'Media',
    difficulty: 'Advanced',
    estimatedTime: '45 min',
    features: ['Audio Player', 'Playlists', 'Recommendations', 'Artist Profiles', 'Offline Mode', 'Lyrics Display'],
    platforms: ['web', 'mobile', 'desktop'],
    color: 'from-green-500 to-teal-600',
    config: {
      name: 'Music Streaming',
      description: 'A music streaming application with playlists and recommendations',
      requirements: 'Create a music streaming app with audio player, playlist management, AI recommendations, artist profiles, offline download, and synchronized lyrics',
      platforms: ['web', 'mobile', 'desktop'],
      architecture_style: 'modular'
    }
  },
  {
    id: 'restaurant',
    name: 'Restaurant App',
    description: 'Restaurant management with menu, reservations, and online ordering',
    icon: Utensils,
    category: 'Food & Beverage',
    difficulty: 'Intermediate',
    estimatedTime: '40 min',
    features: ['Digital Menu', 'Online Ordering', 'Table Reservations', 'Reviews', 'Delivery Tracking', 'Loyalty Program'],
    platforms: ['web', 'mobile'],
    color: 'from-orange-500 to-red-600',
    config: {
      name: 'Restaurant App',
      description: 'A restaurant management and ordering application',
      requirements: 'Build a restaurant app with digital menu, online ordering, table reservations, customer reviews, delivery tracking, and loyalty program',
      platforms: ['web', 'mobile'],
      architecture_style: 'modular'
    }
  },
  {
    id: 'travel',
    name: 'Travel Booking',
    description: 'Travel booking platform with flights, hotels, and trip planning',
    icon: Plane,
    category: 'Travel',
    difficulty: 'Advanced',
    estimatedTime: '55 min',
    features: ['Flight Search', 'Hotel Booking', 'Trip Planner', 'Reviews', 'Price Alerts', 'Itinerary'],
    platforms: ['web', 'mobile'],
    color: 'from-sky-500 to-blue-600',
    config: {
      name: 'Travel Booking',
      description: 'A comprehensive travel booking and planning platform',
      requirements: 'Create a travel booking platform with flight search, hotel reservations, trip planner, user reviews, price alerts, and detailed itinerary management',
      platforms: ['web', 'mobile'],
      architecture_style: 'modular'
    }
  }
];

const categories = ['All', 'Business', 'Content', 'Social', 'Communication', 'Personal', 'Education', 'Healthcare', 'Media', 'Food & Beverage', 'Travel'];

const TemplateLibrary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = async (template) => {
    setIsCreating(true);
    try {
      const response = await api.createProject(template.config);
      navigate(`/projects/${response.data.id}`);
    } catch (error) {
      console.error('Error creating project from template:', error);
      alert('Failed to create project. Please try again.');
    }
    setIsCreating(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-500/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'Advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm mb-4"
          >
            <Zap className="w-4 h-4 mr-2" />
            Quick Start Templates
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Template Library
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Jump-start your project with our pre-built templates. Each template is fully customizable and production-ready.
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800/50 border border-purple-500/20 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white border border-purple-500/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gray-800/50 backdrop-blur-lg border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Template Header */}
              <div className={`p-6 ${viewMode === 'list' ? 'flex items-center space-x-6 flex-1' : ''}`}>
                <div className={`flex items-start ${viewMode === 'list' ? 'flex-1' : 'justify-between mb-4'}`}>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${template.color}`}>
                    <template.icon className="w-6 h-6 text-white" />
                  </div>
                  {template.popular && viewMode === 'grid' && (
                    <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                      <Star className="w-3 h-3" />
                      <span>Popular</span>
                    </span>
                  )}
                </div>

                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <h3 className="text-xl font-semibold text-white mb-2">{template.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{template.description}</p>

                  {/* Features (Grid only) */}
                  {viewMode === 'grid' && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.features.slice(0, 3).map((feature) => (
                        <span key={feature} className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                      {template.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs">
                          +{template.features.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-2 py-1 rounded ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                    <span className="flex items-center space-x-1 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{template.estimatedTime}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-gray-400">
                      <Code className="w-4 h-4" />
                      <span>{template.platforms.join(', ')}</span>
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className={viewMode === 'list' ? '' : 'mt-4'}>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    disabled={isCreating}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {isCreating ? (
                      <span>Creating...</span>
                    ) : (
                      <>
                        <span>Use Template</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateLibrary;
