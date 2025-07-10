// src/pages/domains/Others.jsx
import { Link } from "react-router-dom";

const Others = () => {
  const posts = [
    {
      id: 701,
      user: "Manoj Kumar",
      avatar: "/placeholder.svg",
      content: "Loud noise pollution from the nearby construction site late at night.",
      location: "Construction Site, Sector 12",
      time: "5 hours ago",
      status: "pending",
      likes: 3,
      comments: 0,
    },
    {
      id: 702,
      user: "Shanti Devi",
      avatar: "/placeholder.svg",
      content: "Illegal encroachment on public land near the temple.",
      location: "Near Hanuman Temple",
      time: "2 days ago",
      status: "complete",
      likes: 9,
      comments: 2,
    },
  ];

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <Link to="/" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
      <h1 className="text-2xl font-bold mb-4">🔧 Other Issues</h1>
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

export default Others;
