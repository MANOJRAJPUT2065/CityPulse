import { apiUrl } from './api';

export const authFetch = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(apiUrl(path), { ...options, headers });

  if (res.status === 401) {
    try { localStorage.clear(); } catch (_) {}
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return res;
};


