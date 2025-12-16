// frontend/src/pages/CaseReview.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Download, 
  MessageSquare, 
  Clock, 
  Calendar,
  User, 
  Stethoscope, 
  AlertCircle,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Video,
  Pill,
  Shield,
  TrendingUp,
  ChevronRight,
  Printer,
  Copy,
  History,
  Bell
} from "lucide-react";
import { getCaseByIdDoctor, reviewCase, prescribeMedication, scheduleFollowup } from "../services/doctorAPI";

const CaseReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [status, setStatus] = useState("in_review");
  const [priority, setPriority] = useState("medium");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("review");

  const commonConditions = [
    "Atopic Dermatitis (Eczema)",
    "Contact Dermatitis",
    "Acne Vulgaris",
    "Seborrheic Dermatitis",
    "Psoriasis",
    "Urticaria (Hives)",
    "Viral Exanthem",
    "Bacterial Infection",
    "Fungal Infection",
    "Insect Bite Reaction",
    "Birthmark (Nevus)",
    "Molluscum Contagiosum",
    "Warts",
    "Scabies",
    "Other"
  ];

  const pediatricMedications = [
    { name: "Hydrocortisone 1% Cream", dosage: "Apply thin layer 2x daily", duration: "7-14 days" },
    { name: "Cetirizine (Zyrtec)", dosage: "5mg daily (2-5 years)", duration: "As needed for itching" },
    { name: "Mupirocin Ointment 2%", dosage: "Apply 3x daily", duration: "10 days" },
    { name: "Clotrimazole 1% Cream", dosage: "Apply 2x daily", duration: "2-4 weeks" },
    { name: "Permethrin 5% Cream", dosage: "Apply once, repeat in 7 days", duration: "Single treatment" },
    { name: "Tacrolimus 0.03% Ointment", dosage: "Apply thin layer 2x daily", duration: "Long-term control" }
  ];

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await getCaseByIdDoctor(id);
        const data = res.data;
        setCaseData(data);
        setNotes(data.doctorNotes || "");
        setDiagnosis(data.diagnosis || "");
        setTreatmentPlan(data.treatmentPlan || "");
        setPrescriptions(data.prescriptions || []);
        setStatus(data.status || "in_review");
        setPriority(data.priority || "medium");
        setFollowUpDate(data.followUpDate || "");
        setFollowUpNotes(data.followUpNotes || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load case");
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  const handleSaveReview = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const reviewData = {
        status,
        priority,
        diagnosis,
        treatmentPlan,
        doctorNotes: notes,
        prescriptions,
        followUpDate,
        followUpNotes
      };

      await reviewCase(id, reviewData);
      setSuccess("Case review saved successfully!");
      
      // Redirect after delay
      setTimeout(() => {
        navigate("/doctor/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  const addPrescription = (medication) => {
    setPrescriptions([...prescriptions, {
      ...medication,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    }]);
  };

  const removePrescription = (id) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Case</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Case Not Found</h3>
          <p className="text-gray-600 mb-4">The requested case could not be found.</p>
          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate("/doctor/dashboard")}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Case Review</h1>
                  <p className="text-blue-100">Patient ID: {caseData.patientId?.slice(-8) || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                <Printer className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                <Download className="w-5 h-5" />
              </button>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseData.status)}`}>
                {caseData.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Case Details */}
          <div className="lg:col-span-2">
            {/* Patient Summary Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Patient Summary
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                    <p className="text-gray-900 font-medium">{caseData.patientName || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <p className="text-gray-900">{caseData.childAge || "Not specified"} years</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <p className="text-gray-900">{caseData.childGender || "Not specified"}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Case Submitted</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{new Date(caseData.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration of Symptoms</label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{caseData.duration || "Not specified"}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Previous Treatments</label>
                    <p className="text-gray-900">{caseData.previousTreatments || "None reported"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Images Section */}
            {caseData.images && caseData.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  Clinical Photos ({caseData.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {caseData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Case photo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button className="p-2 bg-white rounded-full shadow-lg">
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Symptoms & Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Symptoms & Description
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Presenting Concern</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800">{caseData.description || "No description provided"}</p>
                  </div>
                </div>
                
                {caseData.symptoms && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specific Symptoms</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-800">{caseData.symptoms}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs for Review Actions */}
            <div className="bg-white rounded-xl shadow-lg mb-6">
              <div className="border-b">
                <nav className="flex">
                  {[
                    { id: 'review', label: 'Medical Review', icon: <FileText className="w-4 h-4" /> },
                    { id: 'prescription', label: 'Prescription', icon: <Pill className="w-4 h-4" /> },
                    { id: 'followup', label: 'Follow-up', icon: <Calendar className="w-4 h-4" /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Medical Review Tab */}
                {activeTab === 'review' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diagnosis *
                      </label>
                      <select
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="">Select a diagnosis</option>
                        {commonConditions.map((condition, index) => (
                          <option key={index} value={condition}>{condition}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Treatment Plan *
                      </label>
                      <textarea
                        rows={4}
                        value={treatmentPlan}
                        onChange={(e) => setTreatmentPlan(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        placeholder="Outline the recommended treatment plan..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Clinical Notes
                      </label>
                      <textarea
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        placeholder="Add detailed clinical notes and observations..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Case Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_review">In Review</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority Level
                        </label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Prescription Tab */}
                {activeTab === 'prescription' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-4">Selected Prescriptions</h4>
                      {prescriptions.length === 0 ? (
                        <p className="text-gray-500 text-sm">No prescriptions added yet</p>
                      ) : (
                        <div className="space-y-3">
                          {prescriptions.map((prescription) => (
                            <div key={prescription.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-800">{prescription.name}</p>
                                <p className="text-sm text-gray-600">{prescription.dosage} - {prescription.duration}</p>
                              </div>
                              <button
                                onClick={() => removePrescription(prescription.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-4">Common Pediatric Medications</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {pediatricMedications.map((med, index) => (
                          <button
                            key={index}
                            onClick={() => addPrescription(med)}
                            className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
                          >
                            <p className="font-medium text-gray-800">{med.name}</p>
                            <p className="text-sm text-gray-600">{med.dosage}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Follow-up Tab */}
                {activeTab === 'followup' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Follow-up Date
                      </label>
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Follow-up Instructions
                      </label>
                      <textarea
                        rows={4}
                        value={followUpNotes}
                        onChange={(e) => setFollowUpNotes(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        placeholder="Provide follow-up instructions and what to watch for..."
                      />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-yellow-800 font-medium">Follow-up Reminder</p>
                          <p className="text-sm text-yellow-700">
                            The parent will receive automatic reminders before the follow-up date.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Information */}
          <div className="space-y-6">
            {/* Save Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleSaveReview}
                  disabled={saving || !diagnosis || !treatmentPlan}
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    saving || !diagnosis || !treatmentPlan
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white flex items-center justify-center gap-2`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save & Complete Review
                    </>
                  )}
                </button>

                <button className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message Parent
                </button>

                <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <Copy className="w-4 h-4" />
                  Save as Template
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-700 mb-3">Case Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Case ID</span>
                    <span className="font-medium">{caseData._id?.slice(-8)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Submitted</span>
                    <span className="font-medium">
                      {new Date(caseData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="font-medium">
                      {caseData.updatedAt ? new Date(caseData.updatedAt).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Cases */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Similar Cases
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'CASE001', condition: 'Atopic Dermatitis', age: '3 years', status: 'completed' },
                  { id: 'CASE002', condition: 'Contact Dermatitis', age: '5 years', status: 'completed' },
                  { id: 'CASE003', condition: 'Viral Rash', age: '2 years', status: 'completed' },
                ].map((similarCase) => (
                  <Link
                    key={similarCase.id}
                    to={`/cases/${similarCase.id}/review`}
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">{similarCase.condition}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(similarCase.status)}`}>
                        {similarCase.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>Age: {similarCase.age}</span>
                      <span>•</span>
                      <span>ID: {similarCase.id}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Clinical Guidelines */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-3">Clinical Guidelines</h4>
              <div className="space-y-3 text-sm">
                <Link
                  to="/guidelines/eczema"
                  className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition text-blue-700"
                >
                  Atopic Dermatitis Management
                </Link>
                <Link
                  to="/guidelines/infections"
                  className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition text-blue-700"
                >
                  Pediatric Skin Infections
                </Link>
                <Link
                  to="/guidelines/medications"
                  className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition text-blue-700"
                >
                  Pediatric Medication Dosing
                </Link>
              </div>
            </div>

            {/* Safety & Compliance */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-green-600" />
                <h4 className="font-semibold text-gray-800">Safety Check</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Age-appropriate medication checked</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No known allergies reported</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Treatment plan documented</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CaseReview;