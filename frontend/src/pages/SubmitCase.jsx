// frontend/src/pages/SubmitCase.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Upload,
  Camera,
  Image as ImageIcon,
  X,
  AlertCircle,
  CheckCircle,
  // Info,
  Clock,
  // Calendar,
  User,
  Thermometer,
  // Droplets,
  // MapPin,
  // MessageSquare,
  ChevronLeft,
  Shield
} from "lucide-react";
import { submitCase } from "../services/patientAPI";

const SubmitCase = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    symptoms: "",
    duration: "",
    childAge: "",
    childGender: "",
    bodyPart: "",
    severity: "moderate",
    previousTreatments: "",
    allergies: "",
    triggers: "",
    temperature: "",
    otherSymptoms: "",
    consentForSharing: false
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);

  const bodyParts = [
    "Face", "Scalp", "Neck", "Chest", "Back", "Abdomen",
    "Arms", "Hands", "Legs", "Feet", "Groin", "Multiple Areas"
  ];

  const severityLevels = [
    { value: "mild", label: "Mild", description: "Minor irritation, no pain" },
    { value: "moderate", label: "Moderate", description: "Visible rash, some discomfort" },
    { value: "severe", label: "Severe", description: "Painful, spreading rapidly" },
    { value: "emergency", label: "Emergency", description: "Fever, difficulty breathing" }
  ];

  const commonSymptoms = [
    "Itching", "Redness", "Swelling", "Blisters", "Dryness",
    "Peeling", "Bumps", "Pustules", "Scaling", "Crusting",
    "Pain", "Burning", "Warmth", "Oozing", "Bleeding"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSymptomToggle = (symptom) => {
    const currentSymptoms = form.symptoms.split(',').filter(s => s.trim());
    if (currentSymptoms.includes(symptom)) {
      setForm(prev => ({
        ...prev,
        symptoms: currentSymptoms.filter(s => s !== symptom).join(', ')
      }));
    } else {
      setForm(prev => ({
        ...prev,
        symptoms: [...currentSymptoms, symptom].join(', ')
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    }));
    setImages([...images, ...newImages].slice(0, 5)); // Limit to 5 images
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!form.title || !form.childAge || !form.childGender) {
          setError("Please fill in all required fields");
          return false;
        }
        return true;
      case 2:
        if (!form.description || !form.symptoms) {
          setError("Please describe the condition and select symptoms");
          return false;
        }
        return true;
      case 3:
        if (images.length === 0) {
          setError("Please upload at least one clear photo of the affected area");
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
      if (activeStep < 4) {
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
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      // Append form data
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append images
      images.forEach((img, index) => {
        formData.append(`images`, img.file);
      });

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await submitCase(formData);

      clearInterval(interval);
      setUploadProgress(100);

      setSuccess("Case submitted successfully! A pediatric dermatologist will review your case within 24 hours.");

      setTimeout(() => navigate("/parent/dashboard"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit case. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/parent/dashboard")}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Submit New Dermatology Case</h1>
              <p className="text-gray-600">Share your child's skin condition with board-certified pediatric dermatologists</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${step === activeStep
                      ? 'bg-blue-600 text-white border-blue-600'
                      : step < activeStep
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-gray-400 border-gray-300'
                    }`}>
                    {step < activeStep ? <CheckCircle size={20} /> : step}
                  </div>
                  <span className="text-xs mt-2 font-medium">
                    {step === 1 ? 'Child Info' : step === 2 ? 'Symptoms' : step === 3 ? 'Photos' : 'Review'}
                  </span>
                </div>
              ))}
              <div className="absolute left-0 right-0 top-6 h-1 bg-gray-200 -z-10">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-green-700 font-medium">{success}</p>
                {uploadProgress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-green-700 mt-1">Uploading... {uploadProgress}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          {/* Step 1: Child Information */}
          {activeStep === 1 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Child Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Case Title (Brief Description) *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="e.g., Red rash on cheeks, Itchy bumps on arms"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Give a brief title that describes the main concern
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Child's Age (Years) *
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
                      placeholder="e.g., 5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Child's Gender *
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
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration of Problem *
                  </label>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      required
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="e.g., 3 days, 2 weeks, 1 month"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Symptoms & Details */}
          {activeStep === 2 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-blue-600" />
                Symptoms & Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                    placeholder="Describe the skin condition in detail. Include when it started, how it has progressed, and any patterns you've noticed..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Common Symptoms *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                    {commonSymptoms.map((symptom) => (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => handleSymptomToggle(symptom)}
                        className={`p-3 text-sm rounded-lg border transition ${form.symptoms.includes(symptom)
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-300'
                          }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    name="symptoms"
                    value={form.symptoms}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Selected symptoms will appear here"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Affected Body Part(s)
                    </label>
                    <select
                      name="bodyPart"
                      value={form.bodyPart}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="">Select affected area</option>
                      {bodyParts.map((part) => (
                        <option key={part} value={part}>{part}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity Level
                    </label>
                    <select
                      name="severity"
                      value={form.severity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      {severityLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label} - {level.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Treatments Tried
                  </label>
                  <textarea
                    name="previousTreatments"
                    value={form.previousTreatments}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                    placeholder="List any creams, medications, or home remedies you've tried..."
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 3: Photo Upload */}
          {activeStep === 3 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Upload Photos
              </h2>

              <div className="space-y-6">
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition bg-gray-50">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Click to upload photos
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Upload clear, well-lit photos from different angles
                      </p>
                      <p
                        type="button"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        Select Photos
                      </p>
                      <p className="text-xs text-gray-500 mt-3">
                        Maximum 5 photos, 5MB each (JPG, PNG)
                      </p>
                    </div>
                  </label>
                </div>

                {images.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">
                      Uploaded Photos ({images.length}/5)
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.preview}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border"
                          />

                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition rounded-lg flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="mt-2 text-xs text-gray-500 truncate">
                            {image.name} ({image.size})
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}


          {/* Step 4: Review & Submit */}
          {activeStep === 4 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Review & Submit
              </h2>

              <div className="space-y-6">
                {/* Review Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Case Summary</h4>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Case Title</p>
                        <p className="font-medium">{form.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Child Age</p>
                        <p className="font-medium">{form.childAge} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium">{form.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Severity</p>
                        <p className="font-medium">
                          {severityLevels.find(s => s.value === form.severity)?.label}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Symptoms</p>
                      <p className="font-medium">{form.symptoms}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium">{form.description}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Photos</p>
                      <p className="font-medium">{images.length} photo(s) uploaded</p>
                    </div>
                  </div>
                </div>

                {/* Consent */}
                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="consentForSharing"
                      checked={form.consentForSharing}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                    />
                    <div>
                      <span className="text-gray-700 font-medium">
                        I consent to share photos and medical information with pediatric dermatologists *
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        Your information will be kept confidential and used only for medical diagnosis in compliance with HIPAA regulations.
                      </p>
                    </div>
                  </label>

                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Privacy Assurance</p>
                        <p className="text-xs text-blue-700">
                          All case information is encrypted and stored securely. Photos are deleted after 90 days unless retained for medical records.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-8 border-t flex justify-between">
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
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5'
                } text-white shadow-lg ml-auto`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3 inline-block"></div>
                  Submitting...
                </>
              ) : activeStep === 4 ? (
                'Submit Case'
              ) : (
                'Continue →'
              )}
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-800 mb-3">Need Help?</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-blue-600 font-bold text-lg mb-2">1</div>
              <h5 className="font-medium text-gray-800 mb-2">Photo Guidelines</h5>
              <p className="text-sm text-gray-600">
                Clear photos help dermatologists make accurate diagnoses. Ensure good lighting and focus.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-blue-600 font-bold text-lg mb-2">2</div>
              <h5 className="font-medium text-gray-800 mb-2">Response Time</h5>
              <p className="text-sm text-gray-600">
                Most cases are reviewed within 24 hours. Urgent cases receive priority attention.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-blue-600 font-bold text-lg mb-2">3</div>
              <h5 className="font-medium text-gray-800 mb-2">Follow-up Care</h5>
              <p className="text-sm text-gray-600">
                You'll receive a 7-day free follow-up to track progress and adjust treatment if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Medical Emergency?</p>
              <p className="text-sm text-red-700">
                If your child has difficulty breathing, high fever, or spreading infection, please call 911 or visit the nearest emergency room immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubmitCase;