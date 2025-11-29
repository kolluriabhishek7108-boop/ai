import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Monitor, 
  Smartphone, 
  Tablet,
  ExternalLink,
  Code,
  Eye,
  XCircle,
  CheckCircle,
  Loader2,
  Settings,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LivePreview = ({ projectId, projectName, generatedCode, status }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [activeTab, setActiveTab] = useState('preview');
  const [logs, setLogs] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const iframeRef = useRef(null);
  const logsEndRef = useRef(null);

  // Device dimensions
  const deviceDimensions = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };

  // Generate preview HTML from code
  useEffect(() => {
    if (generatedCode && Object.keys(generatedCode).length > 0) {
      generatePreviewHtml(generatedCode);
    }
  }, [generatedCode]);

  const generatePreviewHtml = (code) => {
    // Extract relevant files for preview
    let appJs = '';
    let appCss = '';
    let indexHtml = '';

    // Parse the generated code structure
    const findFile = (obj, filename) => {
      for (const key in obj) {
        if (key.includes(filename)) {
          return typeof obj[key] === 'string' ? obj[key] : null;
        }
        if (typeof obj[key] === 'object') {
          const found = findFile(obj[key], filename);
          if (found) return found;
        }
      }
      return null;
    };

    appJs = findFile(code, 'App.js') || findFile(code, 'App.jsx') || '';
    appCss = findFile(code, 'App.css') || findFile(code, 'styles.css') || '';

    // Create a standalone HTML preview
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName || 'Preview'}</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
      min-height: 100vh;
    }
    ${appCss}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${appJs || `
    function App() {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-purple-500/30">
            <h1 className="text-4xl font-bold text-white mb-4">${projectName || 'Your App'}</h1>
            <p className="text-gray-300 mb-6">Your application preview will appear here</p>
            <div className="flex items-center justify-center space-x-2 text-purple-400">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating code...</span>
            </div>
          </div>
        </div>
      );
    }
    `}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`;

    setPreviewHtml(html);
    addLog('info', 'Preview generated successfully');
  };

  const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-50), { type, message, timestamp }]);
  };

  const handleStart = () => {
    setIsRunning(true);
    addLog('success', 'Preview started');
  };

  const handleStop = () => {
    setIsRunning(false);
    addLog('info', 'Preview stopped');
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.src = 'about:blank';
      setTimeout(() => {
        iframe.srcdoc = previewHtml;
      }, 100);
      addLog('info', 'Preview refreshed');
    }
  };

  const handleOpenExternal = () => {
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    addLog('info', 'Opened preview in new tab');
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Terminal className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusBadge = () => {
    if (status === 'completed') {
      return (
        <span className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
          <CheckCircle className="w-3 h-3" />
          <span>Ready</span>
        </span>
      );
    } else if (status === 'generating') {
      return (
        <span className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Generating</span>
        </span>
      );
    }
    return (
      <span className="flex items-center space-x-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
        <span>Pending</span>
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900/50 backdrop-blur-lg border border-purple-500/20 rounded-xl overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-purple-500/20 flex items-center justify-between bg-gray-800/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Live Preview</span>
          </div>
          {getStatusBadge()}
        </div>

        <div className="flex items-center space-x-2">
          {/* Device Mode Toggle */}
          <div className="flex items-center bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded transition-all ${
                deviceMode === 'desktop' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Desktop"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded transition-all ${
                deviceMode === 'tablet' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Tablet"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded transition-all ${
                deviceMode === 'mobile' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Mobile"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Toggle */}
          <div className="flex items-center bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm transition-all ${
                activeTab === 'preview' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm transition-all ${
                activeTab === 'console' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Console</span>
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleRefresh}
            className="p-2 bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenExternal}
            className="p-2 bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-all"
            title="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-60px)]' : 'h-[500px]'}`}>
        <AnimatePresence mode="wait">
          {activeTab === 'preview' ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center bg-gray-950 p-4"
            >
              <div
                className="bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300"
                style={{
                  width: deviceDimensions[deviceMode].width,
                  height: deviceDimensions[deviceMode].height,
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={previewHtml}
                  title="Live Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="console"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full bg-gray-950 p-4 overflow-auto font-mono text-sm"
            >
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Console output will appear here</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 py-1 px-2 rounded hover:bg-gray-800/50"
                    >
                      {getLogIcon(log.type)}
                      <span className="text-gray-500 text-xs">[{log.timestamp}]</span>
                      <span className={`flex-1 ${
                        log.type === 'error' ? 'text-red-400' :
                        log.type === 'success' ? 'text-green-400' :
                        'text-gray-300'
                      }`}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-purple-500/20 flex items-center justify-between bg-gray-800/50 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400' : 'bg-gray-500'}`} />
            <span>{isRunning ? 'Running' : 'Stopped'}</span>
          </span>
          <span>Device: {deviceMode}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{deviceDimensions[deviceMode].width} × {deviceDimensions[deviceMode].height}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LivePreview;
