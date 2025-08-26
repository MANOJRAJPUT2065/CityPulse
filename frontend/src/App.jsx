import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Notifications from "./pages/Notifications";
import RequireAuth from "./RequireAuth";
import Bookmarks from "./pages/Bookmarks";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./pages/NotFound";

import Water from "./pages/domains/Water.jsx";
import Garbage from "./pages/domains/Garbage.jsx";
import Road from "./pages/domains/Road.jsx";
import Street from "./pages/domains/Street.jsx";
import Animals from "./pages/domains/Animals.jsx";
import Recycling from "./pages/domains/Recycling.jsx";
import Others from "./pages/domains/Others.jsx";

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Dashboards */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="user">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Domain-specific Routes */}
      <Route
        path="/notifications"
        element={
          <RequireAuth>
            <Notifications />
          </RequireAuth>
        }
      />
      <Route
        path="/bookmarks"
        element={
          <RequireAuth>
            <Bookmarks />
          </RequireAuth>
        }
      />
      <Route path="/domain/water" element={<Water />} />
      <Route path="/domain/garbage" element={<Garbage />} />
      <Route path="/domain/road" element={<Road />} />
      <Route path="/domain/street" element={<Street />} />
      <Route path="/domain/animals" element={<Animals />} />
      <Route path="/domain/recycling" element={<Recycling />} />
      <Route path="/domain/others" element={<Others />} />

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
