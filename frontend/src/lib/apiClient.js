import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// ============ AUTHENTICATION ============
export const auth = {
  signup: (data) => apiClient.post('/api/auth/signup', data),
  login: (data) => apiClient.post('/api/auth/login', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  googleSignIn: (data) => apiClient.post('/api/auth/google', data),
};

// ============ POSTS ============
export const posts = {
  getAll: (params) => apiClient.get('/api/post', { params }),
  create: (formData) => apiClient.post('/api/post/post', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => apiClient.put(`/api/post/${id}`, data),
  delete: (id) => apiClient.delete(`/api/post/${id}`),
  addComment: (id, data) => apiClient.post(`/api/post/${id}/comments`, data),
  deleteComment: (postId, commentId) => apiClient.delete(`/api/post/${postId}/comments/${commentId}`),
};

// ============ ADMIN ============
export const admin = {
  getAllPosts: (params) => apiClient.get('/api/admin', { params }),
  updatePostStatus: (id, status) => apiClient.put(`/api/admin/posts/${id}`, { status }),
  exportCSV: () => apiClient.get('/api/admin/export.csv'),
};

// ============ BOOKMARKS ============
export const bookmarks = {
  getAll: () => apiClient.get('/api/bookmarks'),
  add: (postId) => apiClient.post(`/api/bookmarks/${postId}`),
  remove: (postId) => apiClient.delete(`/api/bookmarks/${postId}`),
};

// ============ NOTIFICATIONS ============
export const notifications = {
  getAll: () => apiClient.get('/api/notifications'),
  markAsRead: (id) => apiClient.put(`/api/notifications/${id}`),
};

// ============ REAL-TIME UPDATES ============
export class RealtimeService {
  constructor(apiUrl = API_BASE) {
    this.apiUrl = apiUrl;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  // Setup SSE (Server-Sent Events) connection
  connectToUpdates(callback) {
    try {
      const token = localStorage.getItem('token');
      const eventSource = new EventSource(`${this.apiUrl}/api/updates?token=${token}`);
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch (e) {
          console.error('Error parsing realtime message:', e);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        this.reconnectToUpdates(callback);
      };

      return eventSource;
    } catch (error) {
      console.error('Error connecting to realtime updates:', error);
      this.reconnectToUpdates(callback);
    }
  }

  reconnectToUpdates(callback) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connectToUpdates(callback);
      }, this.reconnectDelay);
    }
  }

  // Polling fallback for updates
  pollUpdates(callback, interval = 3000) {
    const pollInterval = setInterval(async () => {
      try {
        const response = await apiClient.get('/api/updates/recent');
        callback(response);
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, interval);
    return pollInterval;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

export const realtimeService = new RealtimeService(API_BASE);

export default apiClient;
