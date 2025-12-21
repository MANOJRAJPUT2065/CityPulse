import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { posts as postAPI } from "../lib/apiClient";
import { useRealtime, useDebouncedSearch } from "../hooks/useRealtime";
import PostCard from "../components/PostCard";
import { Upload, Plus, Search, X } from "lucide-react";

const Dashboard = () => {
  const { user, showError, showSuccess } = useApp();
  const [postContent, setPostContent] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("water");
  const [location, setLocation] = useState("Detecting...");
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [filterDomain, setFilterDomain] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);
  const [rawSearch, setRawSearch] = useState("");
  const search = useDebouncedSearch(rawSearch);

  const domains = [
    { id: "water", name: "Water", emoji: "💧" },
    { id: "garbage", name: "Garbage", emoji: "🗑️" },
    { id: "road", name: "Road", emoji: "🚗" },
    { id: "street", name: "Street", emoji: "💡" },
    { id: "animals", name: "Animals", emoji: "🐕" },
    { id: "recycling", name: "Recycling", emoji: "♻️" },
    { id: "others", name: "Others", emoji: "🔧" },
  ];

  // Detect location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setLocation(data.display_name || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        } catch {
          setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        }
      },
      () => setLocation("Unable to detect")
    );
  }, []);

  // Fetch posts
  const { data: response, loading: loadingPosts } = useRealtime(
    () =>
      postAPI.getAll({
        domain: filterDomain === "all" ? undefined : filterDomain,
        status: statusFilter === "all" ? undefined : statusFilter,
        search,
        sort: sortBy,
        page,
        limit: 10,
      }),
    3000
  );
  
  const posts = response?.posts || [];

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    if (!postContent.trim() || !selectedDomain || !location) {
      showError("Please fill all fields");
      return;
    }

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("content", postContent);
      formData.append("domain", selectedDomain);
      formData.append("location", location);
      if (mediaFile) formData.append("media", mediaFile);

      await postAPI.create(formData);

      showSuccess("Post created successfully!");
      setPostContent("");
      setSelectedDomain("water");
      setMediaFile(null);
      setPreviewUrl(null);
      setShowForm(false);
      setPage(1);
    } catch (err) {
      showError(err.message || "Failed to create post");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-4">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={20} />
              New Issue
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search issues..."
                value={rawSearch}
                onChange={(e) => setRawSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
              />
            </div>

            <select
              value={filterDomain}
              onChange={(e) => {
                setFilterDomain(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
            >
              <option value="all">All Domains</option>
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.emoji} {d.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="likes">Most Liked</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post Form */}
          {showForm && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold dark:text-white">Report an Issue</h2>
                <button onClick={() => setShowForm(false)}>
                  <X className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Domain */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {domains.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDomain(d.id)}
                        className={`p-3 rounded-lg text-center text-sm ${
                          selectedDomain === d.id
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800"
                        }`}
                      >
                        <div>{d.emoji}</div>
                        <div className="text-xs">{d.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    disabled
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-slate-300"
                  />
                  <p className="text-xs text-slate-500 mt-1">Auto-detected</p>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Describe the issue..."
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white min-h-24"
                  />
                </div>

                {/* Media */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Add Photo
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMediaChange}
                      className="hidden"
                      id="media-input"
                    />
                    <label htmlFor="media-input" className="cursor-pointer">
                      <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {mediaFile ? mediaFile.name : "Click to upload"}
                      </span>
                    </label>
                  </div>
                  {previewUrl && (
                    <div className="mt-3 relative">
                      <img src={previewUrl} alt="preview" className="w-full h-40 object-cover rounded-lg" />
                      <button
                        onClick={() => {
                          setMediaFile(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  onClick={handlePost}
                  disabled={isCreating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-2 rounded-lg"
                >
                  {isCreating ? "Posting..." : "Post Issue"}
                </button>
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            {loadingPosts && (!posts || posts.length === 0) ? (
              <div className="text-center py-12 text-slate-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                Loading posts...
              </div>
            ) : !posts || posts.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="font-medium">No posts found</p>
              </div>
            ) : (
              posts?.map((post) => <PostCard key={post._id} post={post} />)
            )}
          </div>

          {/* Load More */}
          {posts && posts.length > 0 && (
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loadingPosts}
              className="w-full py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {loadingPosts ? "Loading..." : "Load More"}
            </button>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div>
                <p className="text-blue-100 text-sm">Total Issues</p>
                <p className="text-2xl font-bold">{posts?.length || 0}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Your Role</p>
                <p className="text-lg font-bold capitalize">{user?.userType || "user"}</p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold dark:text-white mb-4">Categories</h3>
            <div className="space-y-2">
              {domains.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setFilterDomain(d.id);
                    setPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    filterDomain === d.id
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {d.emoji} {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2">Tips</h3>
            <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <li>• Clear descriptions help</li>
              <li>• Add photos for visibility</li>
              <li>• Include locations</li>
              <li>• Track status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
