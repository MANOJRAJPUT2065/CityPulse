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

  const handleGoogle = async () => {
    try {
      /* global google */
      if (!window.google || !window.google.accounts || !import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        alert('Google SDK or Client ID missing');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (resp) => {
          try {
            const idToken = resp?.credential;
            if (!idToken) return alert('Google sign-in failed');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken })
            });
            const data = await res.json();
            if (res.ok) {
              localStorage.setItem('token', data.token);
              localStorage.setItem('userType', data.user.userType);
              localStorage.setItem('user', JSON.stringify(data.user));
              navigate(data.user.userType === 'admin' ? '/admin-dashboard' : '/dashboard');
            } else {
              alert(data.message || 'Google sign-in failed');
            }
          } catch (err) {
            console.error('Google sign-in error:', err);
            alert('Google sign-in error');
          }
        },
      });

      // One Tap prompt; if you prefer button rendering use renderButton instead
      window.google.accounts.id.prompt();
    } catch (err) {
      console.error('Google init error:', err);
      alert('Google init error');
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

            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-1 text-sm text-gray-600">Sign in to continue reporting and tracking civic issues.</p>

            {/* Social (placeholder) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={handleGoogle} className="w-full rounded-md border bg-white px-3 py-2 text-sm hover:bg-gray-50">Sign in with Google</button>
              <button onClick={() => alert('Facebook sign-in coming soon')} className="w-full rounded-md border bg-white px-3 py-2 text-sm hover:bg-gray-50">Sign in with Facebook</button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs uppercase text-gray-400">or continue with email</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 outline-none ring-2 ring-transparent focus:ring-blue-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 outline-none ring-2 ring-transparent focus:ring-blue-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-medium text-gray-700">Login as</div>
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
                Sign In
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              New to CityPulse? <Link to="/signup" className="text-blue-700 hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
