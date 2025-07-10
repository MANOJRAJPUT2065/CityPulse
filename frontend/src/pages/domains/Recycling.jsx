// src/pages/domains/Recycling.jsx
import { Link } from "react-router-dom";

const Recycling = () => {
  const posts = [
    {
      id: 601,
      user: "Kavita Rao",
      avatar: "/placeholder.svg",
      content: "Recycling bins are full and haven't been emptied for a week.",
      location: "Near City Library",
      time: "10 hours ago",
      status: "pending",
      likes: 4,
      comments: 1,
    },
    {
      id: 602,
      user: "Rajesh Kumar",
      avatar: "/placeholder.svg",
      content: "No recycling facility available in our new housing society.",
      location: "Green Valley Society",
      time: "3 days ago",
      status: "complete",
      likes: 6,
      comments: 0,
    },
  ];

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <Link to="/" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
      <h1 className="text-2xl font-bold mb-4">♻️ Recycling Issues</h1>
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

export default Recycling;
