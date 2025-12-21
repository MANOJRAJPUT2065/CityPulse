import { useEffect, useState, useCallback } from 'react';
import { realtimeService } from '../lib/apiClient';

/**
 * Hook for real-time updates using polling
 * @param {Function} fetchFn - Function to call for fetching data
 * @param {number} interval - Polling interval in ms (default: 3000)
 * @param {boolean} enabled - Whether to enable polling (default: true)
 */
export const useRealtime = (fetchFn, interval = 3000, enabled = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;
    let pollInterval = null;

    const fetch = async () => {
      try {
        setLoading(true);
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetch();

    // Setup polling
    pollInterval = setInterval(fetch, interval);

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [fetchFn, interval, enabled]);

  return { data, loading, error };
};

/**
 * Hook for real-time notifications
 */
export const useNotifications = (enabled = true) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const handleNotification = (data) => {
      if (data.type === 'new-notification') {
        setNotifications(prev => [data.notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      } else if (data.type === 'notification-read') {
        setNotifications(prev =>
          prev.map(n => n._id === data.notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    };

    realtimeService.on('notification', handleNotification);

    return () => {
      realtimeService.off('notification', handleNotification);
    };
  }, [enabled]);

  return { notifications, unreadCount };
};

/**
 * Hook for real-time post updates
 */
export const usePostUpdates = (enabled = true) => {
  const [postUpdates, setPostUpdates] = useState([]);

  useEffect(() => {
    if (!enabled) return;

    const handlePostUpdate = (data) => {
      if (data.type === 'post-created') {
        setPostUpdates(prev => [
          { id: data.post._id, type: 'created', post: data.post, timestamp: new Date() },
          ...prev.slice(0, 9) // Keep last 10
        ]);
      } else if (data.type === 'post-updated') {
        setPostUpdates(prev => [
          { id: data.post._id, type: 'updated', post: data.post, timestamp: new Date() },
          ...prev.filter(u => u.id !== data.post._id).slice(0, 9)
        ]);
      }
    };

    realtimeService.on('post-update', handlePostUpdate);

    return () => {
      realtimeService.off('post-update', handlePostUpdate);
    };
  }, [enabled]);

  return { postUpdates };
};

/**
 * Hook for managing real-time connection status
 */
export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
};

/**
 * Hook for auto-refresh data at intervals
 */
export const useAutoRefresh = (callback, interval = 5000, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    let refreshInterval = setInterval(callback, interval);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [callback, interval, enabled]);
};

/**
 * Hook for debounced search
 */
export const useDebouncedSearch = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default {
  useRealtime,
  useNotifications,
  usePostUpdates,
  useConnectionStatus,
  useAutoRefresh,
  useDebouncedSearch,
};
