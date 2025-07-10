import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, userType }),
      });

      const data = await res.json();
      console.log("🔐 Signup Response:", data);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.user.userType);
        localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Fix

        if (data.user.userType === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <Link to="/" className="text-blue-600 hover:underline text-sm inline-block mb-4">
          ← Back to Home
        </Link>
        <h2 className="text-2xl font-bold mb-2 text-center">Join CityPulse</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Create your account to report and solve civic issues
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded" required />
          <input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded" required />

          <div className="text-sm font-medium mb-2">Account Type</div>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input type="radio" value="user" checked={userType === "user"} onChange={() => setUserType("user")} />
              <span>Citizen</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" value="admin" checked={userType === "admin"} onChange={() => setUserType("admin")} />
              <span>Admin</span>
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
