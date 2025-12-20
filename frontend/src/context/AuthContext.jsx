// frontend/src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore auth on refresh
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");

        console.log("Auth restore attempt:", { 
          hasUser: !!storedUser, 
          hasToken: !!storedToken, 
          hasRole: !!storedRole 
        });

        if (storedToken && storedUser && storedRole) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          setRole(storedRole);
          console.log("Auth restored successfully:", { role: storedRole });
        } else {
          console.log("No auth data found in localStorage");
        }
      } catch (err) {
        console.error("Auth restore failed:", err);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function - expects API response format
  const login = (userData, authToken) => {
    console.log("Login called with:", { 
      userData, 
      hasToken: !!authToken,
      userRole: userData?.role 
    });

    if (!userData || !authToken) {
      console.error("Login failed: Missing userData or token");
      return;
    }

    if (!userData.role) {
      console.error("Login failed: userData missing role property");
      return;
    }

    // Store in state
    setUser(userData);
    setToken(authToken);
    setRole(userData.role);

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    localStorage.setItem("role", userData.role);

    console.log("Login successful. Role set to:", userData.role);
  };

  const logout = () => {
    console.log("Logging out user:", user?.email);
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.clear();
    console.log("Logout complete");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        isAuthenticated: !!token && !!role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};