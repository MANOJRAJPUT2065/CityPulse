import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
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

      {/* Open Dashboards for now */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      {/* Domain-specific Routes */}
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
