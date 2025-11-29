import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance
const apiClient = axios.create({
  baseURL: API,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const projectsAPI = {
  create: (data) => apiClient.post('/projects', data),
  getAll: () => apiClient.get('/projects'),
  getById: (id) => apiClient.get(`/projects/${id}`),
  update: (id, data) => apiClient.put(`/projects/${id}`, data),
  delete: (id) => apiClient.delete(`/projects/${id}`),
  generate: (id) => apiClient.post(`/projects/${id}/generate`),
  getStatus: (id) => apiClient.get(`/projects/${id}/status`),
  getCode: (id) => apiClient.get(`/projects/${id}/code`),
};

// Agents API
export const agentsAPI = {
  getTypes: () => apiClient.get('/agents/types'),
  createTask: (data) => apiClient.post('/agents/tasks', data),
  getTask: (id) => apiClient.get(`/agents/tasks/${id}`),
  analyze: (text) => apiClient.post('/agents/analyze', { text }),
};

export default apiClient;
