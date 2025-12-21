import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { realtimeService } from '../lib/apiClient';
import { useNotifications, usePostUpdates } from '../hooks/useRealtime';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  const { notifications, unreadCount } = useNotifications(!!user);
  const { postUpdates } = usePostUpdates(!!user);

  // Initialize user from storage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('connected');
    const handleOffline = () => setConnectionStatus('disconnected');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show success message for 3 seconds
  const showSuccess = useCallback((message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  }, []);

  // Show error message for 3 seconds
  const showError = useCallback((message) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  }, []);

  // Login user
  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  // Logout user
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  // Update user
  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    // User state
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.userType === 'admin',

    // Loading and error states
    isLoading,
    setIsLoading,
    error,
    showError,
    success,
    showSuccess,

    // Connection status
    connectionStatus,
    isOnline: connectionStatus === 'connected',

    // Real-time data
    notifications,
    unreadCount,
    postUpdates,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export default AppContext;
