import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Domain Components
import Water from "../pages/domains/Water";
import Garbage from "../pages/domains/Garbage";
import Road from "../pages/domains/Road";
import Street from "../pages/domains/Street";
import Animals from "../pages/domains/Animals";
import Recycling from "../pages/domains/Recycling";
import Others from "../pages/domains/Others";

const Dashboard = () => {
  const [postContent, setPostContent] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [location, setLocation] = useState("Detecting...");
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [filterDomain, setFilterDomain] = useState("all");

  const domains = [
    { id: "water", name: "Water", emoji: "💧" },
    { id: "garbage", name: "Garbage", emoji: "🗑️" },
    { id: "road", name: "Road", emoji: "🚗" },
    { id: "street", name: "Street", emoji: "💡" },
    { id: "animals", name: "Animals", emoji: "🐕" },
    { id: "recycling", name: "Recycling", emoji: "♻️" },
    { id: "others", name: "Others", emoji: "🔧" },
  ];

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
      const res = await fetch("http://localhost:5000/api/post/post", {
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
      } else {
        alert(data.message || "Failed to post issue");
      }
    } catch (err) {
      console.error("Post error:", err);
      alert("Server error");
    }
  };

  const renderDomainComponent = () => {
    switch (filterDomain) {
      case "water":
        return <Water />;
      case "garbage":
        return <Garbage />;
      case "road":
        return <Road />;
      case "street":
        return <Street />;
      case "animals":
        return <Animals />;
      case "recycling":
        return <Recycling />;
      case "others":
        return <Others />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar and Filter Sidebar remain unchanged */}
        {/* ... */}

        {/* Main Content */}
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

          {filterDomain === "all"
            ? null // map posts here
            : renderDomainComponent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
