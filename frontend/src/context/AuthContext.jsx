import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // contains {_id, name, role, token}
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start / refresh
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load auth user:", error);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login (parent / doctor)
  const login = (userData) => {
    /**
     * userData must be:
     * {
     *   _id,
     *   name,
     *   role,   // "parent" | "doctor"
     *   token
     * }
     */
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    role: user?.role || null,
    token: user?.token || null,
    isAuthenticated: !!user?.token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);
