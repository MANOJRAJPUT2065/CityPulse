// src/pages/domains/Road.jsx
import { Link } from "react-router-dom";

const Road = () => {
  const posts = [
    {
      id: 301,
      user: "Suresh Kumar",
      avatar: "/placeholder.svg",
      content: "Large pothole on the main road near the market, causing traffic issues.",
      location: "Main Road, Market Area",
      time: "4 hours ago",
      status: "pending",
      likes: 10,
      comments: 4,
    },
    {
      id: 302,
      user: "Deepa Mehta",
      avatar: "/placeholder.svg",
      content: "Road construction debris left unattended on the sidewalk, blocking pedestrian path.",
      location: "Gandhi Nagar",
      time: "2 days ago",
      status: "complete",
      likes: 7,
      comments: 1,
    },
  ];

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <Link to="/" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
      <h1 className="text-2xl font-bold mb-4">🚗 Road Issues</h1>
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded shadow mb-4">
          <div className="flex items-center gap-2">
            <img src={post.avatar} className="w-8 h-8 rounded-full" />
            <div>
              <p className="font-semibold">{post.user}</p>
              <p className="text-sm text-gray-500">{post.time}</p>
            </div>
            <span className={`ml-auto text-xs px-2 py-1 rounded ${post.status === "complete" ? "bg-green-500 text-white" : "bg-yellow-400 text-white"}`}>
              {post.status}
            </span>
          </div>
          <p className="mt-2">{post.content}</p>
          <p className="text-sm text-gray-500">📍 {post.location}</p>
          <div className="flex gap-4 text-sm mt-2">
            <span>❤️ {post.likes}</span>
            <span>💬 {post.comments}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Road;
