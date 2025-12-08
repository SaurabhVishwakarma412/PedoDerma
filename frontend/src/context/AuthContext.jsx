// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // can store user object
  const [role, setRole] = useState(null); // "parent" | "doctor"
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    if (storedToken && storedRole) {
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setRole(storedRole);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (role, userData, jwtToken) => {
    setUser(userData || null);
    setRole(role);
    setToken(jwtToken);

    localStorage.setItem("role", role);
    localStorage.setItem("token", jwtToken || "");
    localStorage.setItem("user", userData ? JSON.stringify(userData) : "");
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    role,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
