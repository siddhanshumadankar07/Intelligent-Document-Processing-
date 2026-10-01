import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT and active Session ID to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clause_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const sessionId = localStorage.getItem('clause_session_id');
  if (sessionId) {
    config.headers['x-session-id'] = sessionId;
  }

  return config;
});

// Handle token expiration or unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('clause_token');
      window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);

export const documentApi = {
  upload: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: (params) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
};

export const chatApi = {
  ask: (data) => api.post('/chat/ask', data),
  getHistory: () => api.get('/chat/history'),
  clear: () => api.delete('/chat/clear'),
};

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateSettings: (data) => api.put('/auth/settings', data),
};

export const sessionApi = {
  getStatus: () => api.get('/session/status'),
  extend: (minutes) => api.post('/session/extend', { minutes }),
  end: () => api.post('/session/end'),
};

export default api;
