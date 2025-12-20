// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Stethoscope, User, AlertCircle, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("parent"); // "parent" or "doctor"
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!form.email.trim()) {
      setError("Email is required");
      return false;
    }
    
    if (!form.password.trim()) {
      setError("Password is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      if (userType === "parent") {
        // Call real parent login endpoint
        const response = await API.post("/patients/login", {
          email: form.email,
          password: form.password
        });

        const { token, user } = response.data;
        login(user, token);
        navigate("/parent/dashboard");
      } else {
        // Call real doctor login endpoint
        const response = await API.post("/doctors/login", {
          email: form.email,
          password: form.password
        });

        const { token, user } = response.data;
        login(user, token);
        navigate("/doctor/dashboard");
      }
    } catch (err) {
      let errorMessage = `Invalid ${userType} credentials. Please try again.`;
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            Welcome Back to Pediatric Dermatology Care
          </h1>
          <p className="text-gray-600">Access your account for seamless skin care consultations</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <LogIn className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Sign In to Your Account</h2>
            </div>

            {/* User Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am logging in as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setUserType("parent");
                    setError(""); // Clear error when switching user type
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    userType === "parent"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <User className={`w-6 h-6 mb-2 ${userType === "parent" ? "text-blue-600" : "text-gray-400"}`} />
                    <span className={`font-medium ${userType === "parent" ? "text-blue-700" : "text-gray-600"}`}>
                      Parent/Guardian
                    </span>
                    <span className="text-xs text-gray-500 mt-1">For patient care</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserType("doctor");
                    setError(""); // Clear error when switching user type
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    userType === "doctor"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Stethoscope className={`w-6 h-6 mb-2 ${userType === "doctor" ? "text-blue-600" : "text-gray-400"}`} />
                    <span className={`font-medium ${userType === "doctor" ? "text-blue-700" : "text-gray-600"}`}>
                      Doctor/Specialist
                    </span>
                    <span className="text-xs text-gray-500 mt-1">For medical providers</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter your email address"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 mr-2 text-gray-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-12"
                      placeholder="Enter your password"
                      disabled={isLoading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50"
                    tabIndex={isLoading ? -1 : 0}
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5 active:translate-y-0'
                  } text-white shadow-lg flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-3" />
                      Sign In as {userType === "parent" ? "Parent" : "Doctor"}
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">or continue with</span>
              <div className="flex border-t border-gray-300"></div>
            </div>

            {/* Alternative Sign In */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium">Google</span>
              </button>
              <button
                type="button"
                className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-gray-700 font-medium">GitHub</span>
              </button>
            </div>

            {/* Registration Link */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                {userType === "parent" 
                  ? "Don't have an account? " 
                  : "Not registered as a doctor? "}
                <Link
                  to={userType === "parent" ? "/register" : "/doctor/register"}
                  className="text-blue-600 font-semibold hover:text-blue-800 hover:underline disabled:opacity-50"
                  tabIndex={isLoading ? -1 : 0}
                >
                  {userType === "parent" ? "Create account" : "Register here"}
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Info Section */}
          <div className="space-y-6">
            {/* Parent Login Info */}
            <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-8 h-8" />
                <h3 className="text-xl font-bold">For Parents & Guardians</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Access your child's medical records and treatment history</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Schedule appointments with pediatric dermatologists</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Upload photos and track treatment progress</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Secure messaging with healthcare providers</span>
                </li>
              </ul>
            </div>

            {/* Doctor Login Info */}
            <div className="bg-linear-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Stethoscope className="w-8 h-8" />
                <h3 className="text-xl font-bold">For Doctors & Specialists</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Access patient cases and medical history</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Provide remote consultations and prescriptions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Collaborate with other healthcare professionals</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Manage appointment schedule and availability</span>
                </li>
              </ul>
            </div>

            {/* Security Note */}
            <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Your Security is Our Priority
              </h4>
              <p className="text-sm text-gray-600">
                All login sessions are encrypted and secured with industry-standard protocols. 
                Your medical data and personal information are protected in compliance with HIPAA regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;