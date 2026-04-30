// frontend/src/pages/ParentDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  Plus, 
  Stethoscope, 
  Bell, 
  Download, 
  Activity,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  ChevronRight,
  Image as ImageIcon,
  Video,
  FilePlus,
  Shield,
  MessageCircle
  
} from "lucide-react";
import { getMyCases, getUpcomingAppointments, getMedicalRecords } from "../services/patientAPI";
import CaseCard from "../components/CaseCard";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("cases"); // cases, appointments, records
  const [darkMode, setDarkMode] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    completed: 0,
    upcoming: 0,
    documents: 0
  });

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'appointment', message: 'Appointment with Dr. Smith tomorrow at 2 PM', time: '2 hours ago', read: false },
    { id: 2, type: 'prescription', message: 'New prescription ready for download', time: '1 day ago', read: false },
    { id: 3, type: 'message', message: 'Dr. Johnson replied to your question', time: '2 days ago', read: true },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        
        let casesData = [];
        let appointmentsData = [];
        let recordsData = [];

        // Fetch cases - REQUIRED
        try {
          const casesRes = await getMyCases();
          casesData = casesRes.data || [];
          setCases(casesData);
        } catch (err) {
          console.error("Error fetching cases:", err);
          setError("Failed to fetch cases");
        }

        // Fetch appointments - OPTIONAL (endpoint may not exist yet)
        try {
          const appointmentsRes = await getUpcomingAppointments();
          appointmentsData = appointmentsRes.data || [];
          setAppointments(appointmentsData);
        } catch (err) {
          console.error("Appointments endpoint not available:", err);
          setAppointments([]);
        }

        // Fetch medical records - OPTIONAL (endpoint may not exist yet)
        try {
          const recordsRes = await getMedicalRecords();
          recordsData = recordsRes.data || [];
          setMedicalRecords(recordsData);
        } catch (err) {
          console.error("Medical records endpoint not available:", err);
          setMedicalRecords([]);
        }

        // Compute stats
        const pending = casesData.filter((c) => c.status === "pending").length;
        const reviewing = casesData.filter((c) => c.status === "in_review").length;
        const completed = casesData.filter((c) => c.status === "completed").length;
        const upcoming = appointmentsData.length;
        const documents = recordsData.length;

        setStats({
          total: casesData.length,
          pending,
          reviewing,
          completed,
          upcoming,
          documents
        });

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'in_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setDarkMode(document.documentElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  // Stat Card Component
  const StatCard = ({ label, value, gradient, icon }) => (
    <div className={`relative overflow-hidden rounded-xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      darkMode 
        ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
        : `bg-gradient-to-br ${gradient}`
    }`}>
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white"></div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white`}>
          {icon}
        </div>
        <span className={`text-2xl font-bold ${darkMode ? "text-white" : "text-white"}`}>{value}</span>
      </div>
      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-white/90"}`}>{label}</p>
    </div>
  );

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Welcome Back, Parent!</h1>
                  <p className="text-blue-100">Track your child's dermatology care journey</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition backdrop-blur-sm">
                  <Bell className="w-6 h-6" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Link
                  to="/cases/submit"
                  className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  New Case
                </Link>
                
                <button
                  onClick={() => navigate('/parent/messages')}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:opacity-90 transition flex items-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <StatCard 
              label="Total Cases" 
              value={stats.total} 
              gradient="from-blue-500 to-blue-600"
              icon={<FileText className="w-5 h-5" />}
            />
            <StatCard 
              label="Pending Review" 
              value={stats.pending} 
              gradient="from-yellow-500 to-orange-500"
              icon={<Clock className="w-5 h-5" />}
            />
            <StatCard 
              label="In Review" 
              value={stats.reviewing} 
              gradient="from-indigo-500 to-purple-500"
              icon={<Stethoscope className="w-5 h-5" />}
            />
            <StatCard 
              label="Completed" 
              value={stats.completed} 
              gradient="from-green-500 to-emerald-500"
              icon={<CheckCircle className="w-5 h-5" />}
            />
            <StatCard 
              label="Upcoming Visits" 
              value={stats.upcoming} 
              gradient="from-purple-500 to-pink-500"
              icon={<Calendar className="w-5 h-5" />}
            />
            <StatCard 
              label="Medical Records" 
              value={stats.documents} 
              gradient="from-gray-600 to-gray-700"
              icon={<FilePlus className="w-5 h-5" />}
            />
          </div>
        </section>

        {/* Dashboard Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Cases & Records */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className={`rounded-xl shadow-lg mb-6 overflow-hidden transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700" 
                : "bg-white"
            }`}>
              <div className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <nav className="flex">
                  {[
                    { id: 'cases', label: 'Medical Cases', icon: <FileText className="w-4 h-4" /> },
                    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
                    { id: 'records', label: 'Medical Records', icon: <FilePlus className="w-4 h-4" /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all duration-300 ${
                        activeTab === tab.id
                          ? darkMode
                            ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/10'
                            : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : darkMode
                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : error ? (
                  <div className={`p-4 rounded-lg border ${
                    darkMode 
                      ? "bg-red-900/20 border-red-800" 
                      : "bg-red-50 border-red-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <AlertCircle className={`w-5 h-5 ${darkMode ? "text-red-400" : "text-red-600"}`} />
                      <p className={darkMode ? "text-red-400" : "text-red-700"}>{error}</p>
                    </div>
                  </div>
                ) : activeTab === 'cases' ? (
                  <>
                    {cases.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                        <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-800"}`}>No cases yet</h3>
                        <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Submit your first case to get started</p>
                        <Link
                          to="/cases/submit"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition transform hover:scale-105"
                        >
                          <Plus className="w-4 h-4" />
                          Submit New Case
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                            Recent Cases ({cases.length})
                          </h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {cases.slice(0, 4).map((c) => (
                            <CaseCard key={c._id} caseData={c} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : activeTab === 'appointments' ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                        Upcoming Appointments ({appointments.length})
                      </h3>
                      <Link
                        to="/book-online"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition transform hover:scale-105"
                      >
                        <Calendar className="w-4 h-4" />
                        Book New Appointment
                      </Link>
                    </div>
                    
                    {appointments.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No upcoming appointments</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {appointments.slice(0, 5).map((apt) => (
                          <div key={apt.id} className={`rounded-lg p-4 transition-all duration-300 hover:shadow-md ${
                            darkMode 
                              ? "bg-gray-700/50 border border-gray-600" 
                              : "bg-blue-50 border border-blue-200"
                          }`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{apt.doctorName}</h4>
                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{apt.specialty}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                {apt.status}
                              </span>
                            </div>
                            <div className="mt-3 flex items-center gap-4 text-sm">
                              <span className={`flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                <Calendar className="w-4 h-4" />
                                {apt.date}
                              </span>
                              <span className={`flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                <Clock className="w-4 h-4" />
                                {apt.time}
                              </span>
                              {apt.type === 'video' && (
                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                  <Video className="w-4 h-4" />
                                  Video Call
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Medical Records Tab
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                        Medical Records ({medicalRecords.length})
                      </h3>
                      <button className={`text-sm font-medium transition ${
                        darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                      }`}>
                        <Download className="w-4 h-4 inline mr-1" />
                        Export All
                      </button>
                    </div>
                    
                    {medicalRecords.length === 0 ? (
                      <div className="text-center py-8">
                        <FilePlus className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No medical records yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {medicalRecords.slice(0, 5).map((record) => (
                          <div key={record.id} className={`rounded-lg p-4 transition-all duration-300 hover:shadow-md ${
                            darkMode 
                              ? "bg-gray-700/50 border border-gray-600 hover:bg-gray-700" 
                              : "bg-gray-50 border border-gray-200 hover:bg-white"
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                  darkMode ? "bg-gray-600" : "bg-blue-100"
                                }`}>
                                  {record.type === 'prescription' ? (
                                    <FileText className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                                  ) : record.type === 'lab' ? (
                                    <Activity className={`w-5 h-5 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                                  ) : (
                                    <ImageIcon className={`w-5 h-5 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                                  )}
                                </div>
                                <div>
                                  <h4 className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{record.title}</h4>
                                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{record.date}</p>
                                </div>
                              </div>
                              <button className={`p-2 transition ${
                                darkMode ? "text-gray-500 hover:text-blue-400" : "text-gray-400 hover:text-blue-600"
                              }`}>
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/cases/submit"
                  className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center backdrop-blur-sm"
                >
                  <Plus className="w-6 h-6 mb-2" />
                  <span className="text-sm">New Case</span>
                </Link>
                <Link
                  to="/messages"
                  className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center backdrop-blur-sm"
                >
                  <MessageSquare className="w-6 h-6 mb-2" />
                  <span className="text-sm">Messages</span>
                </Link>
                <Link
                  to="/book-online"
                  className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center backdrop-blur-sm"
                >
                  <Calendar className="w-6 h-6 mb-2" />
                  <span className="text-sm">Book Visit</span>
                </Link>
                <Link
                  to="/profile"
                  className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center backdrop-blur-sm"
                >
                  <User className="w-6 h-6 mb-2" />
                  <span className="text-sm">Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Notifications & Recent Activity */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700" 
                : "bg-white"
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                  <Bell className="w-5 h-5" />
                  Notifications
                </h3>
                {unreadNotificationsCount > 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {unreadNotificationsCount} new
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer hover:shadow-md ${
                      notification.read 
                        ? darkMode
                          ? 'bg-gray-700/30 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                        : darkMode
                          ? 'bg-blue-900/20 border-blue-800'
                          : 'bg-blue-50 border-blue-200'
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-1 rounded ${
                        notification.type === 'appointment' 
                          ? darkMode ? 'bg-green-900/30' : 'bg-green-100'
                          : notification.type === 'prescription'
                          ? darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                          : darkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                      }`}>
                        {notification.type === 'appointment' ? (
                          <Calendar className={`w-4 h-4 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                        ) : notification.type === 'prescription' ? (
                          <FileText className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                        ) : (
                          <MessageSquare className={`w-4 h-4 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>{notification.message}</p>
                        <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700" 
                : "bg-white"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Recent Activity</h3>
              <div className="space-y-4">
                {cases.slice(0, 5).map((c) => (
                  <div key={c._id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      darkMode ? "bg-gray-700" : "bg-blue-100"
                    }`}>
                      <Activity className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                        Case "<span className="font-medium">{c.title}</span>" was updated to{" "}
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(c.status)}`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </p>
                      <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                        {new Date(c.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointment (if any) */}
            {appointments.length > 0 && (
              <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-semibold mb-3">Next Appointment</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{appointments[0].doctorName}</h4>
                      <p className="text-sm opacity-90">{appointments[0].specialty}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{appointments[0].date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{appointments[0].time}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 bg-white text-green-600 font-medium rounded-lg hover:bg-gray-100 transition transform hover:scale-105">
                    Join Appointment
                  </button>
                </div>
              </div>
            )}

            {/* Need Help */}
            <div className={`rounded-xl p-6 transition-colors duration-300 ${
              darkMode 
                ? "bg-blue-900/20 border border-blue-800" 
                : "bg-blue-50 border border-blue-200"
            }`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Need Help?</h3>
              <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Our support team is here to assist you with any questions about your child's care.
              </p>
              <div className="space-y-2">
                <Link
                  to="/contact"
                  className={`block text-center py-2 rounded-lg transition text-sm font-medium ${
                    darkMode 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Contact Support
                </Link>
                <Link
                  to="/#faq"
                  className={`block text-center py-2 rounded-lg transition text-sm font-medium border ${
                    darkMode 
                      ? "border-blue-600 text-blue-400 hover:bg-blue-900/20" 
                      : "border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className={`mt-8 rounded-xl p-6 transition-colors duration-300 ${
          darkMode 
            ? "bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-800/50" 
            : "bg-gradient-to-r from-indigo-50 to-purple-50"
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            Tips for Better Pediatric Dermatology Care
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg transition-all duration-300 hover:shadow-md ${
              darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white shadow-sm"
            }`}>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg mb-2 w-8 h-8 rounded-full flex items-center justify-center">1</div>
              <h4 className={`font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Clear Photos</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Take clear, well-lit photos of skin conditions from multiple angles for accurate diagnosis.
              </p>
            </div>
            <div className={`p-4 rounded-lg transition-all duration-300 hover:shadow-md ${
              darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white shadow-sm"
            }`}>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg mb-2 w-8 h-8 rounded-full flex items-center justify-center">2</div>
              <h4 className={`font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Track Symptoms</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Keep a symptom diary noting when issues started, triggers, and what makes them better or worse.
              </p>
            </div>
            <div className={`p-4 rounded-lg transition-all duration-300 hover:shadow-md ${
              darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white shadow-sm"
            }`}>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg mb-2 w-8 h-8 rounded-full flex items-center justify-center">3</div>
              <h4 className={`font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Regular Follow-ups</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Schedule regular check-ins with your dermatologist to monitor treatment progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ParentDashboard;