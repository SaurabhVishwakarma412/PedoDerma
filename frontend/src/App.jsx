// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ParentDashboard from "./pages/ParentDashboard";
import SubmitCase from "./pages/SubmitCase";
import CaseDetails from "./pages/CaseDetails";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorsList from "./pages/DoctorsList";
import Messaging from "./pages/Messaging";
import DoctorMessaging from "./pages/DoctorMessaging";

import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  console.log("ProtectedRoute state:", { isAuthenticated, role, loading, allowedRoles });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.log(`Role ${role} not allowed. Allowed: ${allowedRoles}`);
    return <Navigate to="/" replace />;
  }

  console.log("Access granted for role:", role);
  return children;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={<DoctorsList />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />

          {/* Parent Routes */}
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute allowedRoles={["parent"]}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cases/submit"
            element={
              <ProtectedRoute allowedRoles={["parent"]}>
                <SubmitCase />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute allowedRoles={["parent"]}>
                <Messaging />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/messages"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorMessaging />
              </ProtectedRoute>
            }
          />


          {/* Shared Routes (both parent and doctor can access) */}
          <Route
            path="/cases/:id"
            element={
              <ProtectedRoute allowedRoles={["parent", "doctor"]}>
                <CaseDetails />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;