// frontend/src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, Phone, Calendar, Baby, AlertCircle, CheckCircle, Shield, UserPlus } from "lucide-react";
import Input from "../components/Input";
import { registerParent } from "../services/patientAPI";

const Register = () => {
  const [form, setForm] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    
    // Child Information
    childName: "",
    childAge: "",
    childGender: "",
    
    // Address
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
  const [activeStep, setActiveStep] = useState(1); // Multi-step form
  
  const navigate = useNavigate();

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
        if (!form.childName || !form.childAge || !form.childGender) {
          setError("Please fill in all child information fields");
          return false;
        }
        if (parseInt(form.childAge) < 0 || parseInt(form.childAge) > 18) {
          setError("Child age must be between 0 and 18");
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

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setError("");
      if (activeStep < 3) {
        setActiveStep(activeStep + 1);
      } else {
        handleSubmit();
      }
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
      // Prepare registration data
      const registrationData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        childName: form.childName,
        childAge: form.childAge,
        childGender: form.childGender,
        address: form.address,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        subscribeToUpdates: form.subscribeToUpdates
      };

      await registerParent(registrationData);
      setSuccess("Registration successful! Redirecting to login...");
      
      // Redirect after delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
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
              <div className="flex justify-between items-center mb-4">
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
                      {step === 1 ? 'Account' : step === 2 ? 'Child Info' : 'Complete'}
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
                    Parent/Guardian Information
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

              {/* Step 2: Child Information */}
              {activeStep === 2 && (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Baby className="w-6 h-6 text-blue-600" />
                    Child Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Child's Full Name *
                      </label>
                      <input
                        type="text"
                        name="childName"
                        value={form.childName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter child's full name"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age (years) *
                        </label>
                        <input
                          type="number"
                          name="childAge"
                          value={form.childAge}
                          onChange={handleChange}
                          required
                          min="0"
                          max="18"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="0-18"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender *
                        </label>
                        <select
                          name="childGender"
                          value={form.childGender}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Skin Concern (Optional)
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                        <option value="">Select if known</option>
                        <option value="eczema">Eczema/Dermatitis</option>
                        <option value="acne">Acne</option>
                        <option value="rashes">Rashes</option>
                        <option value="birthmarks">Birthmarks</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
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
                    title: "Expert Pediatric Dermatologists",
                    desc: "Access board-certified specialists in children's skin care"
                  },
                  {
                    icon: "📱",
                    title: "24/7 Online Access",
                    desc: "Consult from home, upload photos, and track progress anytime"
                  },
                  {
                    icon: "💊",
                    title: "Digital Prescriptions",
                    desc: "Get prescriptions specifically for pediatric medications"
                  },
                  {
                    icon: "🔄",
                    title: "Free Follow-ups",
                    desc: "7-day free follow-up consultations included"
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
                  <span>1-800-PED-SKIN</span>
                </div>
                <a 
                  href="mailto:support@pediatricderm.com" 
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition"
                >
                  <Mail className="w-4 h-4" />
                  support@pediatricderm.com
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