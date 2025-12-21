import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '../hooks/useRealtime';

const RealtimeNotificationToast = () => {
  const { notifications } = useNotifications(true);
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      const notifWithId = { ...latestNotification, id: Date.now() };

      setVisibleNotifications(prev => [notifWithId, ...prev].slice(0, 3));

      const timer = setTimeout(() => {
        setVisibleNotifications(prev => prev.filter(n => n.id !== notifWithId.id));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const removeNotification = (id) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {visibleNotifications.map((notif) => (
        <div
          key={notif.id}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 flex items-start space-x-3 animate-slide-in-right max-w-sm"
        >
          <div className="flex-shrink-0">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {notif.title}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {notif.message}
            </p>
          </div>
          <button
            onClick={() => removeNotification(notif.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default RealtimeNotificationToast;
