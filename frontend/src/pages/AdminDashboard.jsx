  // import { useEffect, useState } from "react";
  // import { useNavigate } from "react-router-dom";

  // const AdminDashboard = () => {
  //   const [posts, setPosts] = useState([]);
  //   const [loading, setLoading] = useState(true);
  //   const navigate = useNavigate();

  //   const token = localStorage.getItem("token");
  //   const user = JSON.parse(localStorage.getItem("user"));

  //   useEffect(() => {
  //     if (!token || user?.userType !== "admin") {
  //       navigate("/login");
  //     } else {
  //       fetchPosts();
  //     }
  //   }, []);

  //   const fetchPosts = async () => {
  //     try {
  //      const res = await fetch("http://localhost:5000/api/post", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       const data = await res.json();
  //       setPosts(data);
  //     } catch (err) {
  //       console.error("Error fetching posts:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const handleDelete = async (id) => {
  //     try {
  //       await fetch(`http://localhost:5000/api/post/${id}`, {
  //         method: "DELETE",
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setPosts(posts.filter((post) => post._id !== id));
  //     } catch (err) {
  //       console.error("Error deleting post:", err);
  //     }
  //   };

  //   const handleToggleStatus = async (id, currentStatus) => {
  //     try {
  //       const res = await fetch(`http://localhost:5000/api/post/${id}/status`, {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ status: currentStatus === "pending" ? "complete" : "pending" }),
  //       });
  //       const updated = await res.json();
  //       setPosts(posts.map((p) => (p._id === id ? updated : p)));
  //     } catch (err) {
  //       console.error("Error updating status:", err);
  //     }
  //   };

  //   const handleComment = async (id, commentText) => {
  //     if (!commentText) return;
  //     try {
  //       const res = await fetch(`http://localhost:5000/api/post/${id}/comment`, {
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
  //       console.error("Error commenting:", err);
  //     }
  //   };

  //   const handleStar = async (id) => {
  //     try {
  //       const res = await fetch(`http://localhost:5000/api/post/${id}/star`, {
  //         method: "PATCH",
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const updated = await res.json();
  //       setPosts(posts.map((p) => (p._id === id ? updated : p)));
  //     } catch (err) {
  //       console.error("Error adding star:", err);
  //     }
  //   };

  //   if (loading) return <div className="p-6">Loading...</div>;

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
  //                 <p className="text-sm text-gray-500">{post.location} | {post.domain}</p>
  //               </div>
  //               <span className={`text-xs px-2 py-1 rounded ${post.status === "complete" ? "bg-green-500 text-white" : "bg-yellow-400 text-white"}`}>
  //                 {post.status}
  //               </span>
  //             </div>
  //             <p className="mt-2">{post.content}</p>
  //             <div className="text-sm text-gray-500 mt-1">❤️ {post.likes || 0} | ⭐ {post.stars || 0}</div>
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



  import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token || userType !== "admin") {
      navigate("/login");
    } else {
      fetchPosts(token);
    }
  }, []);

  const fetchPosts = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("📦 Posts fetched:", data);
      setPosts(data);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error("❌ Error deleting post:", err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: currentStatus === "pending" ? "complete" : "pending",
        }),
      });
      const updated = await res.json();
      setPosts(posts.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("❌ Error updating status:", err);
    }
  };

  const handleStar = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/${id}/star`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = await res.json();
      setPosts(posts.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("❌ Error adding star:", err);
    }
  };

  const handleComment = async (id, commentText) => {
    const token = localStorage.getItem("token");
    if (!commentText) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });
      const updated = await res.json();
      setPosts(posts.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("❌ Error commenting:", err);
    }
  };

  if (loading) return <div className="p-6">Loading posts...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded shadow mb-4">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{post.user?.name || "Unknown User"}</p>
                <p className="text-sm text-gray-500">
                  {post.location} | {post.domain}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  post.status === "complete"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {post.status}
              </span>
            </div>
            <p className="mt-2">{post.content}</p>
            <div className="text-sm text-gray-500 mt-1">
              ❤️ {post.likes || 0} | ⭐ {post.stars || 0}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleToggleStatus(post._id, post.status)}
                className="text-white bg-blue-500 px-3 py-1 rounded"
              >
                Toggle Status
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                className="text-white bg-red-500 px-3 py-1 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => handleStar(post._id)}
                className="text-white bg-yellow-500 px-3 py-1 rounded"
              >
                Add Star
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const comment = e.target.elements.comment.value;
                handleComment(post._id, comment);
                e.target.reset();
              }}
              className="mt-2"
            >
              <input
                name="comment"
                placeholder="Add comment"
                className="border p-1 rounded w-2/3 mr-2"
              />
              <button
                type="submit"
                className="bg-gray-700 text-white px-2 py-1 rounded"
              >
                Comment
              </button>
            </form>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
