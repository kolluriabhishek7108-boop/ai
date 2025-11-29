import React, { useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FileCode, ChevronRight, Search, X, Edit3, Eye, Save, Download, RotateCcw, Copy, Check, AlertCircle, Wand2 } from 'lucide-react';

const CodePreview = ({ files, projectName, onFilesChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedFiles, setEditedFiles] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState({});
  const [copied, setCopied] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isFormatting, setIsFormatting] = useState(false);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Sample files structure for demo
  const fileStructure = files || {
    'frontend': {
      'src': {
        'App.js': `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Welcome to ${projectName || 'Your App'}!</h1>
      <p>Start building amazing features.</p>
    </div>
  );
}

export default App;`,
        'App.css': `.App {
  text-align: center;
  padding: 20px;
}

h1 {
  color: #6366f1;
  font-size: 2.5rem;
}`,
        'index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
      },
      'package.json': `{
  "name": "${projectName?.toLowerCase().replace(/\s+/g, '-') || 'app'}",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  }
}`
    },
    'backend': {
      'app': {
        'main.py': `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="${projectName || 'App'} API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to ${projectName || 'App'} API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}`,
        'models.py': `from pydantic import BaseModel
from typing import Optional

class Item(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    price: float`,
        'database.py': `from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client.${projectName?.toLowerCase().replace(/\s+/g, '_') || 'app'}_db`
      },
      'requirements.txt': `fastapi==0.109.0
uvicorn[standard]==0.27.0
motor==3.3.2
pydantic==2.5.3`
    }
  };

  // Flatten file structure for easier searching
  const flattenFiles = (obj, path = '') => {
    let result = [];
    Object.keys(obj).forEach(key => {
      const newPath = path ? `${path}/${key}` : key;
      if (typeof obj[key] === 'string') {
        result.push({ path: newPath, content: obj[key] });
      } else {
        result = [...result, ...flattenFiles(obj[key], newPath)];
      }
    });
    return result;
  };

  // Get the current content (edited or original)
  const getCurrentContent = useCallback((filePath) => {
    return editedFiles[filePath] !== undefined ? editedFiles[filePath] : null;
  }, [editedFiles]);

  const allFiles = flattenFiles(fileStructure);
  const filteredFiles = searchTerm
    ? allFiles.filter(f => f.path.toLowerCase().includes(searchTerm.toLowerCase()))
    : allFiles;

  // Language detection for Monaco
  const getLanguage = (filePath) => {
    const ext = filePath?.split('.').pop()?.toLowerCase();
    const langMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'css': 'css',
      'scss': 'scss',
      'html': 'html',
      'json': 'json',
      'md': 'markdown',
      'txt': 'plaintext',
      'yml': 'yaml',
      'yaml': 'yaml',
      'sh': 'shell',
      'bash': 'shell',
      'sql': 'sql',
      'xml': 'xml'
    };
    return langMap[ext] || 'plaintext';
  };

  // Handle Monaco Editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure editor settings
    editor.updateOptions({
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      formatOnPaste: true,
      formatOnType: false,
    });

    // Set up validation for markers
    monaco.editor.onDidChangeMarkers((uris) => {
      const markers = monaco.editor.getModelMarkers({});
      const errors = markers.filter(m => m.severity === monaco.MarkerSeverity.Error);
      setValidationErrors(errors);
    });
  };

  // Handle editor content changes
  const handleEditorChange = useCallback((value) => {
    if (selectedFile && isEditMode) {
      setEditedFiles(prev => ({
        ...prev,
        [selectedFile.path]: value
      }));
      setHasUnsavedChanges(prev => ({
        ...prev,
        [selectedFile.path]: value !== selectedFile.content
      }));
    }
  }, [selectedFile, isEditMode]);

  // Save changes (update local state)
  const handleSave = useCallback(() => {
    if (selectedFile && editedFiles[selectedFile.path] !== undefined) {
      // Create updated file structure by traversing and updating
      const updateNestedObject = (obj, pathParts, newContent) => {
        if (pathParts.length === 1) {
          return { ...obj, [pathParts[0]]: newContent };
        }
        const [first, ...rest] = pathParts;
        return {
          ...obj,
          [first]: updateNestedObject(obj[first], rest, newContent)
        };
      };

      const pathParts = selectedFile.path.split('/');
      const updatedStructure = updateNestedObject(fileStructure, pathParts, editedFiles[selectedFile.path]);
      
      // Call parent callback if provided
      if (onFilesChange) {
        onFilesChange(updatedStructure);
      }

      // Update selected file content
      setSelectedFile(prev => ({
        ...prev,
        content: editedFiles[selectedFile.path]
      }));

      // Clear unsaved status
      setHasUnsavedChanges(prev => ({
        ...prev,
        [selectedFile.path]: false
      }));
    }
  }, [selectedFile, editedFiles, fileStructure, onFilesChange]);

  // Revert changes
  const handleRevert = useCallback(() => {
    if (selectedFile) {
      setEditedFiles(prev => {
        const newState = { ...prev };
        delete newState[selectedFile.path];
        return newState;
      });
      setHasUnsavedChanges(prev => ({
        ...prev,
        [selectedFile.path]: false
      }));
    }
  }, [selectedFile]);

  // Copy code to clipboard
  const handleCopy = useCallback(async () => {
    const content = getCurrentContent(selectedFile?.path) || selectedFile?.content;
    if (content) {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [selectedFile, getCurrentContent]);

  // Format code using Monaco's built-in formatter
  const handleFormat = useCallback(async () => {
    if (editorRef.current) {
      setIsFormatting(true);
      await editorRef.current.getAction('editor.action.formatDocument')?.run();
      setTimeout(() => setIsFormatting(false), 500);
    }
  }, []);

  // Download single file
  const handleDownloadFile = useCallback(() => {
    if (selectedFile) {
      const content = getCurrentContent(selectedFile.path) || selectedFile.content;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.path.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [selectedFile, getCurrentContent]);

  // Download all files as ZIP
  const handleDownloadAll = useCallback(async () => {
    // Simple text file export (for complex ZIP, would need jszip library)
    const exportData = allFiles.map(file => ({
      path: file.path,
      content: getCurrentContent(file.path) || file.content
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'project'}-files.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [allFiles, projectName, getCurrentContent]);

  const toggleFolder = (folder) => {
    const newSet = new Set(expandedFolders);
    if (newSet.has(folder)) {
      newSet.delete(folder);
    } else {
      newSet.add(folder);
    }
    setExpandedFolders(newSet);
  };

  // Check if file has unsaved changes
  const fileHasChanges = (filePath) => hasUnsavedChanges[filePath];

  const renderFileTree = (obj, path = '', level = 0) => {
    return Object.keys(obj).map(key => {
      const newPath = path ? `${path}/${key}` : key;
      const isFolder = typeof obj[key] === 'object';
      const isExpanded = expandedFolders.has(newPath);
      const hasChanges = !isFolder && fileHasChanges(newPath);

      return (
        <div key={newPath}>
          <div
            className={`flex items-center space-x-2 px-3 py-2 hover:bg-white/5 cursor-pointer transition-all ${
              selectedFile?.path === newPath ? 'bg-purple-500/20 border-l-2 border-purple-500' : ''
            }`}
            style={{ paddingLeft: `${level * 16 + 12}px` }}
            onClick={() => {
              if (isFolder) {
                toggleFolder(newPath);
              } else {
                const content = getCurrentContent(newPath) || obj[key];
                setSelectedFile({ path: newPath, content: obj[key] });
              }
            }}
          >
            {isFolder && (
              <ChevronRight
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            )}
            {!isFolder && <FileCode className="w-4 h-4 text-purple-400" />}
            <span className={`text-sm ${hasChanges ? 'text-yellow-400 italic' : 'text-gray-300'}`}>
              {key}
              {hasChanges && <span className="ml-1 text-yellow-500">●</span>}
            </span>
          </div>
          {isFolder && isExpanded && renderFileTree(obj[key], newPath, level + 1)}
        </div>
      );
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's' && isEditMode) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, handleSave]);

  // Total unsaved files count
  const unsavedCount = Object.values(hasUnsavedChanges).filter(Boolean).length;

  return (
    <div className="grid grid-cols-12 gap-4 h-[650px]">
      {/* File Tree - Left Panel */}
      <div className="col-span-3 bg-gray-900/50 backdrop-blur-lg border border-purple-500/20 rounded-xl overflow-hidden flex flex-col">
        {/* File Tree Header */}
        <div className="p-3 border-b border-purple-500/20 bg-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-semibold">Explorer</span>
            {unsavedCount > 0 && (
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                {unsavedCount} unsaved
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-9 pr-8 py-1.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        
        {/* File Tree Content */}
        <div className="flex-1 overflow-y-auto py-2">
          {searchTerm ? (
            filteredFiles.map(file => (
              <div
                key={file.path}
                className={`flex items-center space-x-2 px-3 py-2 hover:bg-white/5 cursor-pointer ${
                  selectedFile?.path === file.path ? 'bg-purple-500/20 border-l-2 border-purple-500' : ''
                }`}
                onClick={() => setSelectedFile(file)}
              >
                <FileCode className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300 text-sm truncate">{file.path}</span>
              </div>
            ))
          ) : (
            renderFileTree(fileStructure)
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-t border-purple-500/20 bg-gray-800/50">
          <button
            onClick={handleDownloadAll}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 text-sm hover:bg-purple-500/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export All Files</span>
          </button>
        </div>
      </div>

      {/* Code Editor - Right Panel */}
      <div className="col-span-9 bg-gray-900/50 backdrop-blur-lg border border-purple-500/20 rounded-xl overflow-hidden flex flex-col">
        {selectedFile ? (
          <>
            {/* Editor Header */}
            <div className="px-4 py-3 border-b border-purple-500/20 flex items-center justify-between bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium text-sm">{selectedFile.path.split('/').pop()}</span>
                </div>
                <span className="text-gray-500 text-xs">{selectedFile.path}</span>
                {hasUnsavedChanges[selectedFile.path] && (
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Modified</span>
                  </span>
                )}
              </div>
              
              {/* Editor Controls */}
              <div className="flex items-center space-x-2">
                {/* Mode Toggle */}
                <div className="flex items-center bg-gray-700/50 rounded-lg p-0.5">
                  <button
                    onClick={() => setIsEditMode(false)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                      !isEditMode ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                      isEditMode ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Action Buttons */}
                {isEditMode && (
                  <>
                    <button
                      onClick={handleFormat}
                      disabled={isFormatting}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm hover:bg-blue-500/30 transition-all disabled:opacity-50"
                      title="Format Code (Prettier)"
                    >
                      <Wand2 className={`w-3.5 h-3.5 ${isFormatting ? 'animate-spin' : ''}`} />
                      <span>Format</span>
                    </button>
                    
                    {hasUnsavedChanges[selectedFile.path] && (
                      <>
                        <button
                          onClick={handleRevert}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm hover:bg-red-500/30 transition-all"
                          title="Revert Changes"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm hover:bg-green-500/30 transition-all"
                          title="Save (Ctrl+S)"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </>
                    )}
                  </>
                )}

                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-600/50 border border-gray-500/30 rounded-lg text-gray-300 text-sm hover:bg-gray-600/70 transition-all"
                  title="Copy Code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-600/50 border border-gray-500/30 rounded-lg text-gray-300 text-sm hover:bg-gray-600/70 transition-all"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={getLanguage(selectedFile.path)}
                value={getCurrentContent(selectedFile.path) || selectedFile.content}
                theme="vs-dark"
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                  readOnly: !isEditMode,
                  minimap: { enabled: true, scale: 1 },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  formatOnPaste: true,
                  bracketPairColorization: { enabled: true },
                  guides: { bracketPairs: true },
                  padding: { top: 16, bottom: 16 },
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  },
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  smoothScrolling: true,
                  renderLineHighlight: 'all',
                  colorDecorators: true,
                }}
              />

              {/* Validation Errors Panel */}
              {validationErrors.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-900/90 backdrop-blur-sm border-t border-red-500/50 p-2 max-h-24 overflow-y-auto">
                  <div className="flex items-center space-x-2 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-semibold">{validationErrors.length} Error(s) Found:</span>
                  </div>
                  {validationErrors.slice(0, 3).map((error, idx) => (
                    <div key={idx} className="text-red-200 text-xs mt-1 pl-6">
                      Line {error.startLineNumber}: {error.message}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Bar */}
            <div className="px-4 py-1.5 border-t border-purple-500/20 flex items-center justify-between bg-gray-800/50 text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                <span>Language: {getLanguage(selectedFile.path)}</span>
                <span>Mode: {isEditMode ? 'Edit' : 'View'}</span>
              </div>
              <div className="flex items-center space-x-4">
                {isEditMode && <span className="text-gray-500">Ctrl+S to save</span>}
                <span>UTF-8</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900/30">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                <FileCode className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">No File Selected</h3>
              <p className="text-gray-400 text-sm">Select a file from the explorer to preview or edit code</p>
              <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Mode</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Mode</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Format</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePreview;