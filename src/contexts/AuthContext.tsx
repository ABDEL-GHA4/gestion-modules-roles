import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { User } from "../types/dataTypes";

type LoginResponse = {
  token: string;
  user: User;
};

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("currentUser");
    const storedToken = sessionStorage.getItem("token");

    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser) as User);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: { username, password }
      });

      setCurrentUser(response.user);
      setIsAuthenticated(true);

      sessionStorage.setItem("currentUser", JSON.stringify(response.user));
      sessionStorage.setItem("token", response.token);

      return true;
    } catch (error) {
      console.error(error);

      setCurrentUser(null);
      setIsAuthenticated(false);

      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("token");

      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);

    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};