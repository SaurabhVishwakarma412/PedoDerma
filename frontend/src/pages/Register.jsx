// frontend/src/pages/Register.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, Phone, AlertCircle, CheckCircle, Shield, UserPlus } from "lucide-react";
import Input from "../components/Input";
import { registerParent, sendOtp, verifyOtp } from "../services/patientAPI";

const Register = () => {
  const [form, setForm] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    
    // Address (Optional)
    address: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Terms
    agreeToTerms: false,
    subscribeToUpdates: true
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (otpCooldown <= 0) return undefined;

    const timer = setTimeout(() => setOtpCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCooldown]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        if (!form.name || !form.email || !form.phone || !form.password) {
          setError("Please fill in all required fields");
          return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
          setError("Please enter a valid email address");
          return false;
        }
        if (form.password.length < 8) {
          setError("Password must be at least 8 characters long");
          return false;
        }
        if (form.password !== form.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        return true;
      case 2:
        if (!/^\d{6}$/.test(otp)) {
          setError("Please enter the 6-digit verification code sent to your email");
          return false;
        }
        return true;
      case 3:
        if (!form.agreeToTerms) {
          setError("You must agree to the Terms of Service and Privacy Policy");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = async () => {
    if (!validateStep(activeStep)) return;

    setError("");
    if (activeStep === 1) {
      setIsLoading(true);
      try {
        await sendOtp(form.email.trim());
        setOtpCooldown(60);
        setActiveStep(2);
      } catch (err) {
        setError(err.response?.data?.message || "Could not send the verification code. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else if (activeStep === 2) {
      setIsLoading(true);
      try {
        await verifyOtp(form.email.trim(), otp.trim());
        setActiveStep(3);
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      handleSubmit();
    }
  };

  const resendOtp = async () => {
    if (otpCooldown > 0) return;

    setIsLoading(true);
    setError("");
    try {
      await sendOtp(form.email.trim());
      setOtpCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend the verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const prevStep = () => {
    setError("");
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const registrationData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        address: form.address,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        subscribeToUpdates: form.subscribeToUpdates,
        childName: "",
        otp
      };

      await registerParent(registrationData);
      setSuccess("Registration successful! Redirecting to login...");
      
      // Redirect after delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err.response?.data || err.message); // Log error for debugging
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Registration Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-around items-center mb-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      step === activeStep 
                        ? 'bg-blue-600 text-white' 
                        : step < activeStep 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step < activeStep ? <CheckCircle size={20} /> : step}
                    </div>
                    <span className="text-xs mt-2 text-gray-600">
                      {step === 1 ? 'Account' : step === 2 ? 'Verify email' : 'Complete'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((activeStep - 1) / 2) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              </div>
            )}

            {/* Form Steps */}
            <div className="">
              {/* Step 1: Account Information */}
              {activeStep === 1 && (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-600" />
                    Patient / Account Information
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="(123) 456-7890"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-12"
                          placeholder="At least 8 characters"
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

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Lock className="w-4 h-4 mr-2 text-gray-400" />
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-12"
                          placeholder="Re-enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Email Verification */}
              {activeStep === 2 && (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-blue-600" />
                    Verify Your Email
                  </h2>

                  <div className="space-y-4">
                    <p className="text-gray-600">
                      We sent a 6-digit verification code to <strong>{form.email}</strong>. The code expires in 5 minutes.
                    </p>
                    <input
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg tracking-[0.35em] text-center text-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={isLoading || otpCooldown > 0}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                    >
                      {otpCooldown > 0 ? `Resend code in ${otpCooldown}s` : "Resend verification code"}
                    </button>
                  </div>
                </>
              )}

              {/* Step 3: Terms & Address */}
              {activeStep === 3 && (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-blue-600" />
                    Complete Registration
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Optional Address Section */}
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Optional: Address Information</h3>
                      <div className="space-y-6">
                        <input
                          type="text"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="Street Address"
                        />
                        <div className="grid md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="City"
                          />
                          <input
                            type="text"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="State"
                          />
                          <input
                            type="text"
                            name="zipCode"
                            value={form.zipCode}
                            onChange={handleChange}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="ZIP Code"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-6">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={form.agreeToTerms}
                          onChange={handleChange}
                          required
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                        />
                        <div>
                          <span className="text-gray-700 font-medium">
                            I agree to the Terms of Service and Privacy Policy *
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            By checking this box, you confirm that you have read and agree to our terms of service, privacy policy, and consent to receive electronic communications.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="pt-6 flex justify-between">
                {activeStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                  >
                    ← Back
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isLoading}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5'
                  } text-white shadow-lg ml-auto`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3 inline-block"></div>
                      Processing...
                    </>
                  ) : activeStep === 3 ? (
                    'Complete Registration'
                  ) : activeStep === 2 ? (
                    'Verify & Continue →'
                  ) : (
                    'Continue →'
                  )}
                </button>
              </div>
            </div>

            {/* Already have account */}
            <div className="mt-2 pt-4 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:text-blue-800 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Benefits & Info */}
          <div className="space-y-8">
            {/* Benefits Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Why Register With Us?</h3>
              <div className="space-y-5">
                {[
                  {
                    icon: "👨‍⚕️",
                    title: "Expert Dermatologists",
                    desc: "Connect your account to skin-case updates, messages, and clinician availability"
                  },
                  {
                    icon: "📱",
                    title: "Skin-case access",
                    desc: "Consult from home, upload photos, and track progress anytime"
                  },
                  {
                    icon: "💊",
                    title: "Digital Prescriptions",
                    desc: "Receive digital prescriptions and treatment plans from your doctor"
                  },
                  {
                    icon: "🔄",
                    title: "Case follow-ups",
                    desc: "Add progress updates and new photos to your existing skin case."
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="text-2xl">{benefit.icon}</div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{benefit.title}</h4>
                      <p className="text-blue-100 text-sm">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
              <h4 className="font-bold text-lg mb-3">Need Help Registering?</h4>
              <p className="text-gray-300 text-sm mb-4">
                Our support team is here to assist you with the registration process.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>1-800-DERM-CARE</span>
                </div>
                <a 
                  href="mailto:support@dermaslot.com" 
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition"
                >
                  <Mail className="w-4 h-4" />
                  support@dermaslot.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
