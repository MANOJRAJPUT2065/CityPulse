import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../lib/api';
import { authFetch } from '../lib/authFetch';

const Bookmarks = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await authFetch('/api/bookmarks');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const renderMedia = (post) => {
    if (!post?.media) return null;
    const src = apiUrl(`/uploads/${post.media}`);
    if (/\.(mp4|webm|ogg)$/i.test(post.media)) {
      return <video controls className="mt-2 w-full rounded"><source src={src} /></video>;
    }
    return <img src={src} alt="Issue" className="mt-2 w-full rounded" />;
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/dashboard" className="text-blue-600">← Back</Link>
          <h1 className="text-xl font-bold">Bookmarks</h1>
          <div />
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center text-gray-600">No bookmarks yet</div>
        ) : (
          <div className="space-y-4">
            {items.map((bm) => (
              <div key={bm._id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{bm.post?.user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{bm.post?.location} • {new Date(bm.post?.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${bm.post?.status === 'complete' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>{bm.post?.status}</span>
                </div>
                <p className="mt-2">{bm.post?.content}</p>
                {renderMedia(bm.post)}
                <div className="text-sm text-gray-500 mt-2">Domain: {bm.post?.domain}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;


