
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (currentUser && !allowedRoles.includes(currentUser.role)) {
    // Redirect to the appropriate dashboard based on role
    if (currentUser.role === "admin") {
      return <Navigate to="/admin/modules" replace />;
    } else if (currentUser.role === "manager") {
      return <Navigate to="/manager/roles" replace />;
    } else if (currentUser.role === "agent") {
      return <Navigate to="/agent/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
