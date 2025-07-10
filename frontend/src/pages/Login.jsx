import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("🔐 Login Response:", data);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.user.userType);
        localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Fix

        if (data.user.userType !== userType) {
          alert("User type mismatch! Please select the correct account type.");
          return;
        }

        if (data.user.userType === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-md">
        <Link to="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
          ← Back to Home
        </Link>

        <h2 className="text-2xl font-bold text-center mb-1">Welcome Back</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Sign in to your CityPulse account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-sm font-medium mb-1">Login as:</div>
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
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
