import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCaseByIdDoctor, reviewCase, getBookedSlots } from "../services/DoctorApi.js";
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle,
  FileText as FileIcon
} from "lucide-react";

const formatCaseId = (id) => {
  if (!id) return "N/A";
  const numericId = parseInt(id.slice(-6), 16).toString().padStart(6, '0');
  return `CASE-${numericId}`;
};

const ReviewCase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0] // Default to tomorrow
  );
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const allSlots = [
    "09:00 AM - 09:30 AM",
    "09:30 AM - 10:00 AM",
    "10:00 AM - 10:30 AM",
    "10:30 AM - 11:00 AM",
    "11:00 AM - 11:30 AM",
    "11:30 AM - 12:00 PM",
    "12:00 PM - 12:30 PM",
    "12:30 PM - 01:00 PM",
    "01:00 PM - 01:30 PM",
    "02:00 PM - 02:30 PM",
    "02:30 PM - 03:00 PM",
    "03:00 PM - 03:30 PM",
    "03:30 PM - 04:00 PM",
    "04:00 PM - 04:30 PM",
    "04:30 PM - 05:00 PM",
    "05:00 PM - 05:30 PM",
    "05:30 PM - 06:00 PM"
  ];

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setDarkMode(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  // Fetch Case details
  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        const res = await getCaseByIdDoctor(id);
        setCaseData(res.data);
        if (res.data.doctorNotes) {
          setDoctorNotes(res.data.doctorNotes);
        }
        if (res.data.appointmentDate) {
          setSelectedDate(res.data.appointmentDate);
        }
        if (res.data.timeSlot) {
          setSelectedSlot(res.data.timeSlot);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load case details");
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  // Fetch booked slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) return;
      try {
        const res = await getBookedSlots(selectedDate);
        setBookedSlots(res.data || []);
      } catch (err) {
        console.error("Error fetching booked slots:", err);
      }
    };
    fetchSlots();
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError("Please select an appointment time slot.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await reviewCase(id, {
        status: "in_review", // accepting a request moves it to in_review / scheduled status
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        doctorNotes
      });
      setSuccess("Case accepted and appointment scheduled successfully!");
      setTimeout(() => navigate("/doctor/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen py-8 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-b from-blue-50 to-white"}`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/doctor/dashboard"
            className={`inline-flex items-center gap-2 text-sm font-medium transition mb-4 ${
              darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Schedule Appointment — {caseData ? formatCaseId(caseData._id) : "Loading..."}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review patient case details and assign a 30-minute time slot.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl dark:bg-red-900/20 dark:border-red-800">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl dark:bg-green-900/20 dark:border-green-800">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-green-700 dark:text-green-300">{success}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patient Case details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-blue-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Patient Details
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-semibold">{caseData.patientName || caseData.childName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Age</p>
                  <p className="font-semibold">{caseData.patientAge || caseData.childAge || "N/A"} years</p>
                </div>
                <div>
                  <p className="text-gray-500">Gender</p>
                  <p className="font-semibold capitalize">{caseData.patientGender || caseData.childGender || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Visit Preference</p>
                  <p className="font-semibold capitalize text-blue-600 dark:text-blue-400">
                    {caseData.visitType === 'offline' ? "🏥 Offline Visit" : "💻 Online Visit"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-semibold">{caseData.duration || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-blue-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FileIcon className="w-4 h-4 text-blue-600" />
                Case Request
              </h2>
              <div className="text-sm space-y-3">
                <div>
                  <p className="text-gray-500">Title</p>
                  <p className="font-semibold">{caseData.title}</p>
                </div>
                <div>
                  <p className="text-gray-500">Description</p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{caseData.description}</p>
                </div>
                <div>
                  <p className="text-gray-500">Symptoms</p>
                  <p className="font-semibold">{caseData.symptoms}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 space-y-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Schedule Appointment Slot
              </h2>

              {/* Date selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Appointment Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(""); // reset selected slot
                  }}
                  required
                  className="w-full max-w-xs px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                />
              </div>

              {/* Slots buttons grid */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Select 30-Minute Time Slot *
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 text-sm font-semibold rounded-xl border text-center transition ${
                          isBooked
                            ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-400 dark:text-red-600 cursor-not-allowed"
                            : isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-102"
                            : "bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-blue-400"
                        }`}
                      >
                        {slot}
                        {isBooked && <span className="block text-[10px] text-red-500 dark:text-red-400 font-normal">Booked</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Assessment Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Clinical Assessment / Prescription Notes (Optional)
                </label>
                <textarea
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  placeholder="Enter initial clinical assessment notes, instructions, or recommendations for the patient..."
                />
              </div>

              {/* Submission buttons */}
              <div className="pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  * Required fields
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-8 py-3 rounded-lg font-semibold text-white transition-all shadow-lg ${
                    submitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5"
                  }`}
                >
                  {submitting ? "Processing..." : "Accept Request & Schedule Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReviewCase;
