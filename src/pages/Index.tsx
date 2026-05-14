
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "./Login";

const Index: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  // Redirect based on user role
  if (currentUser?.role === "admin") {
    return <Navigate to="/admin/modules" replace />;
  } else if (currentUser?.role === "manager") {
    return <Navigate to="/manager/roles" replace />;
  } else if (currentUser?.role === "agent") {
    return <Navigate to="/agent/dashboard" replace />;
  }
  
  // Fallback
  return <Login />;
};

export default Index;
