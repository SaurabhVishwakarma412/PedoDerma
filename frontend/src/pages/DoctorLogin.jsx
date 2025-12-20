// frontend/src/pages/DoctorLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Stethoscope, Shield, AlertCircle, LogIn, Key, BriefcaseMedical } from "lucide-react";
import { loginDoctor } from "../services/doctorAPI";
import { useAuth } from "../context/AuthContext";

const DoctorLogin = () => {
  const [form, setForm] = useState({ 
    email: "", 
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await loginDoctor({
        email: form.email,
        password: form.password
      });
      
      const { user, token, licenseInfo } = res.data;
      
      // Add license info to user object if provided
      const doctorData = {
        ...user,
        licenseInfo: licenseInfo || null
      };
      
      login("doctor", doctorData, token);
      
      // Store remember me preference
      if (form.rememberMe) {
        localStorage.setItem('doctorRememberMe', 'true');
      } else {
        localStorage.removeItem('doctorRememberMe');
      }
      
      navigate("/doctor/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle demo doctor login
  const handleDemoLogin = async () => {
    setForm({
      email: "demo.doctor@pediatricderm.com",
      password: "demo123",
      rememberMe: false
    });
    
    // Auto-submit after a brief delay
    setTimeout(() => {
      document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <BriefcaseMedical className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Doctor Portal Access
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Secure login for board-certified pediatric dermatologists and healthcare providers
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Side - Login Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            {/* Form Header */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Medical Provider Login</h2>
                <p className="text-sm text-gray-500">Access your professional dashboard</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Demo Account Notice */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 font-medium text-sm mb-1">Try Demo Account</p>
                  <p className="text-blue-700 text-sm">
                    Want to explore?{" "}
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      className="font-semibold hover:text-blue-900 hover:underline"
                    >
                      Click here for demo access
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  Professional Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50"
                  placeholder="doctor.name@hospital.org"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 mr-2 text-gray-400" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={form.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Remember this device</span>
                </label>
                
                <Link
                  to="/doctor/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  isLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 active:translate-y-0'
                } text-white shadow-lg flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-3" />
                    Access Doctor Dashboard
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Need to verify your identity?</span>
                </div>
              </div>

              {/* Alternative Verification */}
              <div className="text-center">
                <Link
                  to="/doctor/verify"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Two-Factor Authentication
                </Link>
              </div>
            </form>

            {/* Registration Link */}
            <div className="mt-10 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-2">
                New to our platform?
              </p>
              <Link
                to="/doctor/register"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
              >
                <BriefcaseMedical className="w-5 h-5 mr-2" />
                Register as Medical Provider
              </Link>
            </div>
          </div>

          {/* Right Side - Info & Features */}
          <div className="space-y-8">
            {/* Features Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8" />
                Secure Medical Dashboard
              </h3>
              <div className="space-y-5">
                {[
                  {
                    title: "Patient Management",
                    desc: "Access and manage pediatric dermatology cases with full medical history"
                  },
                  {
                    title: "Telemedicine Tools",
                    desc: "Video consultations, secure messaging, and digital prescription capabilities"
                  },
                  {
                    title: "Medical Records",
                    desc: "HIPAA-compliant access to patient records, photos, and treatment plans"
                  },
                  {
                    title: "Collaboration Hub",
                    desc: "Connect with other specialists for complex case discussions"
                  },
                  {
                    title: "Schedule Management",
                    desc: "Manage appointments, availability, and follow-up schedules"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{feature.title}</h4>
                      <p className="text-blue-100 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Compliance */}
            <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">HIPAA Compliant</h4>
                  <p className="text-sm text-gray-600">Ensuring patient data security</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>End-to-end encryption for all communications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure patient data storage and access controls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Audit trails for all medical record access</span>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-lg">
              <h4 className="font-bold text-lg mb-3">Technical Support</h4>
              <p className="text-gray-300 text-sm mb-4">
                Having issues with login or access? Our dedicated medical support team is available 24/7.
              </p>
              <div className="space-y-3">
                <a 
                  href="mailto:doctorsupport@pediatricderm.com" 
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition"
                >
                  <Mail className="w-4 h-4" />
                  doctorsupport@pediatricderm.com
                </a>
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  <span>Support: 1-800-MED-PORTAL</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/doctor/guidelines"
                  className="p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition text-center text-sm font-medium text-blue-700"
                >
                  Clinical Guidelines
                </Link>
                <Link
                  to="/resources"
                  className="p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition text-center text-sm font-medium text-blue-700"
                >
                  Medical Resources
                </Link>
                <Link
                  to="/doctor/training"
                  className="p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition text-center text-sm font-medium text-blue-700"
                >
                  Platform Training
                </Link>
                <Link
                  to="/faq"
                  className="p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition text-center text-sm font-medium text-blue-700"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            By accessing this portal, you confirm that you are a licensed medical professional 
            and agree to comply with our{" "}
            <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> 
            {" "}and{" "}
            <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            <span>© 2024 Pediatric Dermatology Platform</span>
            <span>•</span>
            <span>Medical License Verification Required</span>
            <span>•</span>
            <span>v2.1.0</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DoctorLogin;