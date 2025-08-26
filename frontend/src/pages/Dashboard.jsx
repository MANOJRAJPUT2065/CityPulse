import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../lib/api";

const Dashboard = () => {
  const [postContent, setPostContent] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [location, setLocation] = useState("Detecting...");
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [filterDomain, setFilterDomain] = useState("all");
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [commentTextById, setCommentTextById] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("new");

  const domains = [
    { id: "water", name: "Water", emoji: "💧" },
    { id: "garbage", name: "Garbage", emoji: "🗑️" },
    { id: "road", name: "Road", emoji: "🚗" },
    { id: "street", name: "Street", emoji: "💡" },
    { id: "animals", name: "Animals", emoji: "🐕" },
    { id: "recycling", name: "Recycling", emoji: "♻️" },
    { id: "others", name: "Others", emoji: "🔧" },
  ];

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();

  // Auto Detect Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Optional: reverse geocoding to get readable address using OpenStreetMap
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setLocation(data.display_name || `${latitude}, ${longitude}`);
        } catch (err) {
          console.error("Location error:", err);
          setLocation(`${latitude}, ${longitude}`);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocation("Unable to detect");
      }
    );
  }, []);

  // Fetch unread notifications count for badge
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const load = async () => {
      try {
        const res = await fetch(apiUrl('/api/notifications'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const count = Array.isArray(data) ? data.filter((n) => !n.read).length : 0;
        setUnreadCount(count);
      } catch (e) {
        // ignore
      }
    };
    load();
  }, []);

  // Fetch posts for feed with pagination
  const fetchPosts = async (reset = false) => {
    try {
      if (reset) {
        setLoadingPosts(true);
      } else {
        setIsLoadingMore(true);
      }

      const params = new URLSearchParams();
      if (filterDomain && filterDomain !== "all") params.set("domain", filterDomain);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('q', search);
      if (sortBy === 'likes' || sortBy === 'stars') params.set('sort', sortBy);
      params.set("page", String(reset ? 1 : page));
      params.set("limit", "10");

      const res = await fetch(apiUrl(`/api/post?${params.toString()}`));
      const data = await res.json();

      const nextPosts = Array.isArray(data?.posts) ? data.posts : [];
      setTotalPages(Number(data?.totalPages || 1));
      setPage(Number(data?.page || 1));
      setPosts((prev) => (reset ? nextPosts : [...prev, ...nextPosts]));
    } catch (err) {
      console.error("Fetch posts error:", err);
    } finally {
      setLoadingPosts(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDomain, statusFilter, sortBy]);

  const handleLoadMore = () => {
    if (page >= totalPages) return;
    setPage((p) => p + 1);
    fetchPosts(false);
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    if (!postContent || !selectedDomain || !location) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("content", postContent);
    formData.append("domain", selectedDomain);
    formData.append("location", location);
    if (mediaFile) formData.append("media", mediaFile);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/api/post/post"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Issue posted successfully!");
        setPostContent("");
        setSelectedDomain("");
        setLocation("Detecting...");
        setMediaFile(null);
        setPreviewUrl(null);
        if (data?.post) {
          setPosts((prev) => [data.post, ...prev]);
        } else {
          // fallback refresh
          setPage(1);
          fetchPosts(true);
        }
      } else {
        alert(data.message || "Failed to post issue");
      }
    } catch (err) {
      console.error("Post error:", err);
      alert("Server error");
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentTextById[postId]?.trim();
    if (!text) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/api/post/${postId}/comment`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      const updated = await res.json();
      if (res.ok) {
        setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
        setCommentTextById((prev) => ({ ...prev, [postId]: "" }));
      } else {
        alert(updated.message || "Failed to add comment");
      }
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  const renderMedia = (post) => {
    if (!post.media) return null;
    const src = apiUrl(`/uploads/${post.media}`);
    const isVideo = /\.(mp4|webm|ogg)$/i.test(post.media);
    if (isVideo) {
      return (
        <video controls className="mt-2 w-full rounded">
          <source src={src} />
        </video>
      );
    }
    return (
      <img src={src} alt="Issue" className="mt-2 w-full rounded" />
    );
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/api/post/${postId}/like`), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = await res.json();
      if (res.ok) {
        setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Profile/Navigation */}
        <aside className="hidden lg:block lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded shadow sticky top-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                {(currentUser?.name || 'U').slice(0,1).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold leading-tight">{currentUser?.name || 'User'}</div>
                <div className="text-xs text-gray-500">{currentUser?.email || ''}</div>
              </div>
            </div>
            <h2 className="font-semibold mb-2">Navigation</h2>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/dashboard" className="text-blue-600">Home</Link>
              <Link to="/notifications" className="text-gray-700 flex items-center gap-2">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </Link>
              <Link to="/bookmarks" className="text-gray-700">Bookmarks</Link>
              <button onClick={() => { localStorage.clear(); location.href = "/"; }} className="text-red-600 text-left">Logout</button>
            </div>
          </div>
        </aside>

        {/* Middle Column */}
        <main className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Report an Issue</h2>
            <textarea
              className="w-full border p-2 rounded mb-4"
              placeholder="What's the issue?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Select Domain</option>
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.emoji} {domain.name}
                  </option>
                ))}
              </select>
              <input
                className="border p-2 rounded"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div>
                <input
                  type="file"
                  id="mediaUpload"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="mediaUpload"
                  className="border p-2 rounded bg-gray-100 cursor-pointer text-center block"
                >
                  📷 Add Media
                </label>
              </div>
            </div>

            {previewUrl && (
              <div className="mb-4">
                <p className="text-sm mb-1">Preview:</p>
                {mediaFile?.type.startsWith("image") ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 rounded border"
                  />
                ) : (
                  <video controls className="max-h-48 rounded border">
                    <source src={previewUrl} type={mediaFile.type} />
                  </video>
                )}
              </div>
            )}

            <button
              onClick={handlePost}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              🚀 Post Issue
            </button>
          </div>

          {/* Feed */}
          <div className="space-y-4">
            {/* Search and filters */}
            <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search issues (content, location)" className="border rounded px-3 py-2 w-full md:max-w-md" />
              <div className="flex flex-wrap gap-2 items-center">
                <select className="border rounded px-2 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="complete">Complete</option>
                </select>
                <select className="border rounded px-2 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="new">Newest</option>
                  <option value="likes">Most Liked</option>
                  <option value="stars">Most Starred</option>
                </select>
                <button onClick={() => { setPage(1); fetchPosts(true); }} className="border rounded px-3 py-2">Apply</button>
              </div>
            </div>
            {loadingPosts ? (
              <div className="p-4 bg-white rounded shadow">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="p-4 bg-white rounded shadow">No posts found.</div>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{post.user?.name || "User"}</p>
                      <p className="text-sm text-gray-500">{post.location} • {new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${post.status === "complete" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>
                      {post.status}
                    </span>
                  </div>

                  <p className="mt-2">{post.content}</p>
                  {renderMedia(post)}

                  <div className="text-sm text-gray-500 mt-2">Domain: {post.domain}</div>

                  {/* Comments */}
                  <div className="mt-3">
                    <div className="flex items-center gap-3 text-sm mb-2">
                      <button onClick={() => handleLike(post._id)} className="px-2 py-1 rounded border">❤️ {post.likes || 0}</button>
                      <button onClick={async () => {
                        try {
                          const res = await fetch(apiUrl(`/api/bookmarks/${post._id}`), { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                          if (!res.ok) alert('Bookmark failed');
                        } catch (_) {}
                      }} className="px-2 py-1 rounded border">🔖 Save</button>
                      <span>💬 {post.comments?.length || 0}</span>
                    </div>
                    {post.comments?.length > 0 && (
                      <div className="mb-2 text-sm text-gray-700">
                        <strong>Comments:</strong>
                        <ul className="list-disc pl-6 mt-1">
                          {post.comments.slice(-3).map((c, idx) => (
                            <li key={idx}><span className="font-medium">{c.user?.name || "User"}:</span> {c.text}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        value={commentTextById[post._id] || ""}
                        onChange={(e) => setCommentTextById((prev) => ({ ...prev, [post._id]: e.target.value }))}
                        className="border p-2 rounded w-full"
                        placeholder="Write a comment..."
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="bg-gray-800 text-white px-3 rounded"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            {posts.length > 0 && page < totalPages && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-4 py-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-60"
                >
                  {isLoadingMore ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Right Column: Domains filter */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded shadow sticky top-4">
            <h2 className="font-semibold mb-3">Domains</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterDomain("all")}
                className={`px-3 py-1 rounded border ${filterDomain === "all" ? "bg-blue-600 text-white" : "bg-white"}`}
              >
                All
              </button>
              {domains.map((d) => (
                <button
                key={d.id}
                onClick={() => setFilterDomain(d.id)}
                className={`px-3 py-1 rounded border ${filterDomain === d.id ? "bg-blue-600 text-white" : "bg-white"}`}
                title={d.name}
                >
                  {d.emoji} {d.name}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
