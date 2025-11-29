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

  const allFiles = flattenFiles(fileStructure);
  const filteredFiles = searchTerm
    ? allFiles.filter(f => f.path.toLowerCase().includes(searchTerm.toLowerCase()))
    : allFiles;

  const getLanguage = (filePath) => {
    const ext = filePath.split('.').pop();
    const langMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'py': 'python',
      'css': 'css',
      'json': 'json'
    };
    return langMap[ext] || 'javascript';
  };

  const toggleFolder = (folder) => {
    const newSet = new Set(expandedFolders);
    if (newSet.has(folder)) {
      newSet.delete(folder);
    } else {
      newSet.add(folder);
    }
    setExpandedFolders(newSet);
  };

  const renderFileTree = (obj, path = '', level = 0) => {
    return Object.keys(obj).map(key => {
      const newPath = path ? `${path}/${key}` : key;
      const isFolder = typeof obj[key] === 'object';
      const isExpanded = expandedFolders.has(newPath);

      return (
        <div key={newPath}>
          <div
            className={`flex items-center space-x-2 px-3 py-2 hover:bg-white/5 cursor-pointer ${
              selectedFile?.path === newPath ? 'bg-purple-500/20' : ''
            }`}
            style={{ paddingLeft: `${level * 16 + 12}px` }}
            onClick={() => {
              if (isFolder) {
                toggleFolder(newPath);
              } else {
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
            <span className="text-gray-300 text-sm">{key}</span>
          </div>
          {isFolder && isExpanded && renderFileTree(obj[key], newPath, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[600px]">
      {/* File Tree */}
      <div className="col-span-3 bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-purple-500/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-10 pr-10 py-2 bg-white/10 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {searchTerm ? (
            filteredFiles.map(file => (
              <div
                key={file.path}
                className={`flex items-center space-x-2 px-3 py-2 hover:bg-white/5 cursor-pointer ${
                  selectedFile?.path === file.path ? 'bg-purple-500/20' : ''
                }`}
                onClick={() => setSelectedFile(file)}
              >
                <FileCode className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300 text-sm">{file.path}</span>
              </div>
            ))
          ) : (
            renderFileTree(fileStructure)
          )}
        </div>
      </div>

      {/* Code Viewer */}
      <div className="col-span-9 bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl overflow-hidden flex flex-col">
        {selectedFile ? (
          <>
            <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">{selectedFile.path}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedFile.content);
                }}
                className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 text-sm hover:bg-purple-500/30 transition-all"
              >
                Copy Code
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <SyntaxHighlighter
                language={getLanguage(selectedFile.path)}
                style={atomOneDark}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  background: 'transparent',
                  fontSize: '0.875rem'
                }}
              >
                {selectedFile.content}
              </SyntaxHighlighter>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a file to preview code</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePreview;