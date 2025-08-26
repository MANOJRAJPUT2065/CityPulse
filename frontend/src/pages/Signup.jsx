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
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {

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
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl">
          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <Link to="/" className="text-sm text-blue-700 hover:underline">← Back</Link>
              <div className="flex items-center gap-2 text-blue-700">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-white font-bold">C</div>
                <span className="font-semibold">CityPulse</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-1 text-sm text-gray-600">Join and start reporting issues that matter.</p>

            {/* Social (placeholder) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={() => alert('Google sign-up coming soon')} className="w-full rounded-md border bg-white px-3 py-2 text-sm hover:bg-gray-50">Sign up with Google</button>
              <button onClick={() => alert('Facebook sign-up coming soon')} className="w-full rounded-md border bg-white px-3 py-2 text-sm hover:bg-gray-50">Sign up with Facebook</button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs uppercase text-gray-400">or sign up with email</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-700">Full Name</label>
                <input type="text" placeholder="Manoj Kumar" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 outline-none ring-2 ring-transparent focus:ring-blue-200" required />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">Email</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 outline-none ring-2 ring-transparent focus:ring-blue-200" required />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">Password</label>
                <input type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 outline-none ring-2 ring-transparent focus:ring-blue-200" required />
              </div>

              <div>
                <div className="mb-2 text-sm font-medium text-gray-700">Account type</div>
                <div className="flex items-center gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="radio" value="user" checked={userType === "user"} onChange={() => setUserType("user")} />
                    <span>Citizen</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" value="admin" checked={userType === "admin"} onChange={() => setUserType("admin")} />
                    <span>Admin</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-white shadow hover:bg-blue-700 active:scale-[.99]">
                Create Account
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account? <Link to="/login" className="text-blue-700 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
