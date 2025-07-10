// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRole, children }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userType !== allowedRole) {
    // Redirect to correct dashboard if role mismatch
    return <Navigate to={userType === "admin" ? "/admin-dashboard" : "/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
