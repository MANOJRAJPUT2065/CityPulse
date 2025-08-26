import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../lib/api';
import { authFetch } from '../lib/authFetch';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await authFetch('/api/notifications');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const markAllRead = async () => {
    try {
      await authFetch('/api/notifications/read-all', { method: 'POST' });
      fetchItems();
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/dashboard" className="text-blue-600">← Back</Link>
          <h1 className="text-xl font-bold">Notifications</h1>
          <button onClick={markAllRead} className="text-sm border px-3 py-1 rounded">Mark all read</button>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center text-gray-600">No notifications</div>
        ) : (
          <div className="space-y-3">
            {items.map((n) => (
              <div key={n._id} className={`bg-white p-4 rounded shadow flex items-start justify-between ${n.read ? '' : 'border-l-4 border-blue-600'}`}>
                <div>
                  <div className="text-sm text-gray-800">{n.message}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.read && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">New</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;


