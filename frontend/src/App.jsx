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

// Layout component for pages with header and footer
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
};

// Layout component for authentication pages (no header/footer)
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes with Header & Footer */}
      <Route path="/" element={
        <MainLayout>
          <Home />
        </MainLayout>
      } />
      <Route path="/about" element={
        <MainLayout>
          <About />
        </MainLayout>
      } />
      <Route path="/contact" element={
        <MainLayout>
          <Contact />
        </MainLayout>
      } />
      <Route path="/doctors" element={
        <MainLayout>
          <DoctorsList />
        </MainLayout>
      } />

      {/* Authentication Routes - No Header & Footer */}
      <Route path="/login" element={
        <AuthLayout>
          <Login />
        </AuthLayout>
      } />
      <Route path="/register" element={
        <AuthLayout>
          <Register />
        </AuthLayout>
      } />
      <Route path="/doctor/login" element={
        <AuthLayout>
          <DoctorLogin />
        </AuthLayout>
      } />

      {/* Parent Routes with Header & Footer */}
      <Route
        path="/parent/dashboard"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <MainLayout>
              <ParentDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/submit"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            {/* <MainLayout> */}
              <AuthLayout>

              <SubmitCase />
              </AuthLayout>
            {/* </MainLayout> */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <MainLayout>
              <Messaging />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Doctor Routes with Header & Footer */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <MainLayout>
              <DoctorDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/messages"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <MainLayout>
              <DoctorMessaging />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Shared Routes (both parent and doctor can access) with Header & Footer */}
      <Route
        path="/cases/:id"
        element={
          <ProtectedRoute allowedRoles={["parent", "doctor"]}>
            <MainLayout>
              <CaseDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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