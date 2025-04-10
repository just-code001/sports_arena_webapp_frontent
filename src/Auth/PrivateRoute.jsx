// src/auth/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "./JwtUtils";

const PrivateRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = getUserRole();

  // Convert allowedRoles to lowercase for comparison
  const allowed = allowedRoles.map(role => role.toLowerCase());

  if (!allowed.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
