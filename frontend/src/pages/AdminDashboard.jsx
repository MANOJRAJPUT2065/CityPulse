//   import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AdminDashboard = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userType = localStorage.getItem("userType");

//     if (!token || userType !== "admin") {
//       navigate("/login");
//     } else {
//       fetchPosts(token);
//     }
//   }, []);

//   const fetchPosts = async (token) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/admin", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       console.log("📦 Posts fetched:", data);
//       setPosts(data);
//     } catch (err) {
//       console.error("❌ Error fetching posts:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     const token = localStorage.getItem("token");
//     try {
//       await fetch(`http://localhost:5000/api/admin/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPosts(posts.filter((post) => post._id !== id));
//     } catch (err) {
//       console.error("❌ Error deleting post:", err);
//     }
//   };

//   const handleToggleStatus = async (id, currentStatus) => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(`http://localhost:5000/api/admin/${id}/status`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           status: currentStatus === "pending" ? "complete" : "pending",
//         }),
//       });
//       const updated = await res.json();
//       setPosts(posts.map((p) => (p._id === id ? updated : p)));
//     } catch (err) {
//       console.error("❌ Error updating status:", err);
//     }
//   };

//   const handleStar = async (id) => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(`http://localhost:5000/api/admin/${id}/star`, {
//         method: "PATCH",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const updated = await res.json();
//       setPosts(posts.map((p) => (p._id === id ? updated : p)));
//     } catch (err) {
//       console.error("❌ Error adding star:", err);
//     }
//   };

//   const handleComment = async (id, commentText) => {
//     const token = localStorage.getItem("token");
//     if (!commentText) return;
//     try {
//       const res = await fetch(`http://localhost:5000/api/admin/${id}/comment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ text: commentText }),
//       });
//       const updated = await res.json();
//       setPosts(posts.map((p) => (p._id === id ? updated : p)));
//     } catch (err) {
//       console.error("❌ Error commenting:", err);
//     }
//   };

//   if (loading) return <div className="p-6">Loading posts...</div>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
//       {posts.length === 0 ? (
//         <p>No posts found.</p>
//       ) : (
//         posts.map((post) => (
//           <div key={post._id} className="bg-white p-4 rounded shadow mb-4">
//             <div className="flex justify-between">
//               <div>
//                 <p className="font-semibold">{post.user?.name || "Unknown User"}</p>
//                 <p className="text-sm text-gray-500">
//                   {post.location} | {post.domain}
//                 </p>
//               </div>
//               <span
//                 className={`text-xs px-2 py-1 rounded ${
//                   post.status === "complete"
//                     ? "bg-green-500 text-white"
//                     : "bg-yellow-500 text-white"
//                 }`}
//               >
//                 {post.status}
//               </span>
//             </div>
//             <p className="mt-2">{post.content}</p>
//             <div className="text-sm text-gray-500 mt-1">
//               ❤️ {post.likes || 0} | ⭐ {post.stars || 0}
//             </div>
//             <div className="mt-3 flex gap-2">
//               <button
//                 onClick={() => handleToggleStatus(post._id, post.status)}
//                 className="text-white bg-blue-500 px-3 py-1 rounded"
//               >
//                 Toggle Status
//               </button>
//               <button
//                 onClick={() => handleDelete(post._id)}
//                 className="text-white bg-red-500 px-3 py-1 rounded"
//               >
//                 Delete
//               </button>
//               <button
//                 onClick={() => handleStar(post._id)}
//                 className="text-white bg-yellow-500 px-3 py-1 rounded"
//               >
//                 Add Star
//               </button>
//             </div>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 const comment = e.target.elements.comment.value;
//                 handleComment(post._id, comment);
//                 e.target.reset();
//               }}
//               className="mt-2"
//             >
//               <input
//                 name="comment"
//                 placeholder="Add comment"
//                 className="border p-1 rounded w-2/3 mr-2"
//               />
//               <button
//                 type="submit"
//                 className="bg-gray-700 text-white px-2 py-1 rounded"
//               >
//                 Comment
//               </button>
//             </form>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;



import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../lib/api";
import { authFetch } from "../lib/authFetch";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    if (!token || userType !== "admin") {
      navigate("/login");
    } else {
      fetchPosts();
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await authFetch("/api/admin");

      const data = await res.json();
      console.log("📦 Posts fetched:", data);
      setPosts(data);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchPosts();

  const stats = useMemo(() => {
    const total = posts.length;
    const pending = posts.filter((p) => p.status === "pending").length;
    const complete = posts.filter((p) => p.status === "complete").length;
    return { total, pending, complete };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (statusFilter === "all") return posts;
    return posts.filter((p) => p.status === statusFilter);
  }, [posts, statusFilter]);

  const handleDelete = async (id) => {
    try {
      await authFetch(`/api/admin/${id}`, { method: "DELETE" });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error("❌ Error deleting post:", err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await authFetch(`/api/admin/${id}/status`, { method: "PATCH" });
      const updated = await res.json();
      setPosts(posts.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("❌ Error toggling status:", err);
    }
  };

  const handleStar = async (id) => {
    try {
      const res = await authFetch(`/api/admin/${id}/star`, { method: "PATCH" });
      const updated = await res.json();
      setPosts(posts.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("❌ Error adding star:", err);
    }
  };

  const handleManage = async (id, payload) => {
    try {
      const res = await authFetch(`/api/admin/${id}/manage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setPosts(posts.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error('❌ Error updating management:', err);
    }
  };

  const handleAddUpdate = async (id, text) => {
    if (!text) return;
    try {
      const res = await authFetch(`/api/admin/${id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const updated = await res.json();
      setPosts(posts.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error('❌ Error adding update:', err);
    }
  };

  const handleComment = async (id, commentText) => {
    if (!commentText) return;
    try {
      const res = await authFetch(`/api/admin/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      });
      const updated = await res.json();
      setPosts(posts.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("❌ Error adding comment:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-12 w-48 bg-white/70 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[1,2,3].map((i) => (
            <div key={i} className="h-24 bg-white/70 rounded shadow-sm animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-60 bg-white/70 rounded shadow-sm animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">← Back</button>
          <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <a href={apiUrl('/api/admin/export.csv')} className="text-sm text-gray-700 border px-3 py-1 rounded hover:bg-gray-50">Export CSV</a>
            <button onClick={refresh} className="text-sm text-gray-700 border px-3 py-1 rounded hover:bg-gray-50">Refresh</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="text-sm text-gray-500">Total Reports</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.complete}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
            { id: "complete", label: "Complete" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setStatusFilter(t.id)}
              className={`px-3 py-1 rounded-full border text-sm transition ${
                statusFilter === t.id ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Post grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg border shadow-sm p-8 text-center text-gray-600">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg border shadow-sm p-5 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                      {(post.user?.name || "U").slice(0,1).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold leading-tight">{post.user?.name || "Unknown User"}</div>
                      <div className="text-xs text-gray-500">{post.location} • {new Date(post.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    post.status === "complete" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {post.status}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-800">{post.content}</div>

                {post.media && (/\.(mp4|webm|ogg)$/i.test(post.media) ? (
                  <video controls className="mt-3 w-full rounded-md border">
                    <source src={apiUrl(`/uploads/${post.media}`)} />
                  </video>
                ) : (
                  <img
                    src={apiUrl(`/uploads/${post.media}`)}
                    alt="Uploaded"
                    className="mt-3 w-full rounded-md border"
                  />
                ))}

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border">{post.domain}</span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border">❤️ {post.likes || 0}</span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border">⭐ {post.stars || 0}</span>
                  {post.severity && (
                    <span className={`px-2 py-0.5 rounded-full border ${
                      post.severity === 'critical' ? 'bg-red-100 text-red-700' : post.severity === 'high' ? 'bg-orange-100 text-orange-700' : post.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>{post.severity}</span>
                  )}
                  {post.deadlineAt && (
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border">Due {new Date(post.deadlineAt).toLocaleDateString()}</span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleToggleStatus(post._id, post.status)}
                    className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                  >
                    {post.status === "complete" ? "Mark Pending" : "Mark Complete"}
                  </button>
                  <button
                    onClick={() => handleStar(post._id)}
                    className="px-3 py-1.5 rounded-md bg-yellow-500 text-white text-sm hover:bg-yellow-600"
                  >
                    Add Star
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this post?")) handleDelete(post._id);
                    }}
                    className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>

                {/* Management controls */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select className="border rounded px-2 py-2" defaultValue={post.severity || 'medium'} onChange={(e) => handleManage(post._id, { severity: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  <input type="date" className="border rounded px-2 py-2" onChange={(e) => handleManage(post._id, { deadlineAt: e.target.value })} />
                  <input type="text" placeholder="Assign to (name - dept)" className="border rounded px-2 py-2" onBlur={(e) => {
                    const [name, type] = e.target.value.split(' - ');
                    handleManage(post._id, { assignee: { name: name || '', type: type || '' } });
                  }} />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const comment = e.currentTarget.elements.comment.value;
                    handleComment(post._id, comment);
                    e.currentTarget.reset();
                  }}
                  className="mt-4 flex gap-2"
                >
                  <input
                    name="comment"
                    placeholder="Add a comment"
                    className="border rounded-md px-3 py-2 w-full"
                  />
                  <button type="submit" className="px-3 py-2 rounded-md bg-gray-800 text-white text-sm hover:bg-black">Comment</button>
                </form>

                {post.updates?.length > 0 && (
                  <div className="mt-4 text-sm">
                    <div className="font-medium mb-1">Progress updates</div>
                    <ul className="space-y-1">
                      {post.updates.slice(-3).map((u, idx) => (
                        <li key={idx} className="text-gray-700">{u.text} <span className="text-xs text-gray-500">• {new Date(u.createdAt).toLocaleString()}</span></li>
                      ))}
                    </ul>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const text = e.currentTarget.elements.update.value;
                    handleAddUpdate(post._id, text);
                    e.currentTarget.reset();
                  }}
                  className="mt-3 flex gap-2"
                >
                  <input name="update" placeholder="Add progress update" className="border rounded-md px-3 py-2 w-full" />
                  <button className="px-3 py-2 rounded-md bg-slate-700 text-white text-sm">Add</button>
                </form>

                {post.comments?.length > 0 && (
                  <div className="mt-3 text-sm">
                    <div className="font-medium mb-1">Recent comments</div>
                    <ul className="space-y-1">
                      {post.comments.slice(-3).map((c, idx) => (
                        <li key={idx} className="text-gray-700">
                          <span className="font-medium">{c.user?.name || "User"}:</span> {c.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
