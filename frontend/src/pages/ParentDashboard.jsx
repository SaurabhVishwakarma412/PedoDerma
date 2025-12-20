// frontend/src/pages/ParentDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Shield
} from "lucide-react";
import { getMyCases, getUpcomingAppointments, getMedicalRecords } from "../services/patientAPI";
import CaseCard from "../components/CaseCard";

const ParentDashboard = () => {
  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("cases"); // cases, appointments, records

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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_review': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <User className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Welcome Back, Parent!</h1>
                  <p className="text-blue-100">Track your child's dermatology care journey</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Last login: Today at 10:30 AM
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Account verified
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                  <Bell className="w-6 h-6" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Link
                  to="/cases/submit"
                  className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Case
                </Link>
                <Link
                  to="/book-online"
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Visit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { 
                label: "Total Cases", 
                value: stats.total, 
                color: "bg-blue-500", 
                icon: <FileText className="w-5 h-5" /> 
              },
              { 
                label: "Pending Review", 
                value: stats.pending, 
                color: "bg-yellow-500", 
                icon: <Clock className="w-5 h-5" /> 
              },
              { 
                label: "In Review", 
                value: stats.reviewing, 
                color: "bg-indigo-500", 
                icon: <Stethoscope className="w-5 h-5" /> 
              },
              { 
                label: "Completed", 
                value: stats.completed, 
                color: "bg-green-500", 
                icon: <CheckCircle className="w-5 h-5" /> 
              },
              { 
                label: "Upcoming Visits", 
                value: stats.upcoming, 
                color: "bg-purple-500", 
                icon: <Calendar className="w-5 h-5" /> 
              },
              { 
                label: "Medical Records", 
                value: stats.documents, 
                color: "bg-gray-500", 
                icon: <FilePlus className="w-5 h-5" /> 
              },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Cases & Records */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg mb-6">
              <div className="border-b">
                <nav className="flex">
                  {[
                    { id: 'cases', label: 'Medical Cases', icon: <FileText className="w-4 h-4" /> },
                    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
                    { id: 'records', label: 'Medical Records', icon: <FilePlus className="w-4 h-4" /> }
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

              {/* Tab Content */}
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : error ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                ) : activeTab === 'cases' ? (
                  <>
                    {cases.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No cases yet</h3>
                        <p className="text-gray-500 mb-6">Submit your first case to get started</p>
                        <Link
                          to="/cases/submit"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                        >
                          <Plus className="w-4 h-4" />
                          Submit New Case
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Recent Cases ({cases.length})
                          </h3>
                          <Link
                            to="/cases"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                          >
                            View All
                            <ChevronRight className="w-4 h-4" />
                          </Link>
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
                      <h3 className="text-lg font-semibold text-gray-800">
                        Upcoming Appointments ({appointments.length})
                      </h3>
                      <Link
                        to="/book-online"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                      >
                        <Calendar className="w-4 h-4" />
                        Book New Appointment
                      </Link>
                    </div>
                    
                    {appointments.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No upcoming appointments</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {appointments.slice(0, 5).map((apt) => (
                          <div key={apt.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-800">{apt.doctorName}</h4>
                                <p className="text-sm text-gray-600">{apt.specialty}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                {apt.status}
                              </span>
                            </div>
                            <div className="mt-3 flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                {apt.date}
                              </span>
                              <span className="flex items-center gap-1 text-gray-600">
                                <Clock className="w-4 h-4" />
                                {apt.time}
                              </span>
                              {apt.type === 'video' && (
                                <span className="flex items-center gap-1 text-blue-600">
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
                      <h3 className="text-lg font-semibold text-gray-800">
                        Medical Records ({medicalRecords.length})
                      </h3>
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        <Download className="w-4 h-4 inline mr-1" />
                        Export All
                      </button>
                    </div>
                    
                    {medicalRecords.length === 0 ? (
                      <div className="text-center py-8">
                        <FilePlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No medical records yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {medicalRecords.slice(0, 5).map((record) => (
                          <div key={record.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-white transition">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  {record.type === 'prescription' ? (
                                    <FileText className="w-5 h-5 text-blue-600" />
                                  ) : record.type === 'lab' ? (
                                    <Activity className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <ImageIcon className="w-5 h-5 text-purple-600" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-800">{record.title}</h4>
                                  <p className="text-sm text-gray-500">{record.date}</p>
                                </div>
                              </div>
                              <button className="p-2 text-gray-400 hover:text-blue-600">
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
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/cases/submit"
                  className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition flex flex-col items-center justify-center"
                >
                  <Plus className="w-6 h-6 mb-2" />
                  <span className="text-sm">New Case</span>
                </Link>
                <Link
                  to="/messages"
                  className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition flex flex-col items-center justify-center"
                >
                  <MessageSquare className="w-6 h-6 mb-2" />
                  <span className="text-sm">Messages</span>
                </Link>
                <Link
                  to="/book-online"
                  className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition flex flex-col items-center justify-center"
                >
                  <Calendar className="w-6 h-6 mb-2" />
                  <span className="text-sm">Book Visit</span>
                </Link>
                <Link
                  to="/profile"
                  className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition flex flex-col items-center justify-center"
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
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h3>
                {unreadNotificationsCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadNotificationsCount} new
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-3 rounded-lg border transition cursor-pointer ${
                      notification.read 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-1 rounded ${
                        notification.type === 'appointment' ? 'bg-green-100' :
                        notification.type === 'prescription' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        {notification.type === 'appointment' ? (
                          <Calendar className="w-4 h-4" />
                        ) : notification.type === 'prescription' ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <MessageSquare className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {cases.slice(0, 5).map((c) => (
                  <div key={c._id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        Case "<span className="font-medium">{c.title}</span>" was updated to{" "}
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(c.status)}`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(c.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointment (if any) */}
            {appointments.length > 0 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-semibold mb-3">Next Appointment</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
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
                  <button className="w-full mt-4 py-2 bg-white text-green-600 font-medium rounded-lg hover:bg-gray-100 transition">
                    Join Appointment
                  </button>
                </div>
              </div>
            )}

            {/* Need Help */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is here to assist you with any questions about your child's care.
              </p>
              <div className="space-y-2">
                <Link
                  to="/contact"
                  className="block text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  Contact Support
                </Link>
                <Link
                  to="/#faq"
                  className="block text-center py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
                >
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Tips for Better Pediatric Dermatology Care
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-blue-600 font-bold text-lg mb-2">1</div>
              <h4 className="font-medium text-gray-800 mb-2">Clear Photos</h4>
              <p className="text-sm text-gray-600">
                Take clear, well-lit photos of skin conditions from multiple angles for accurate diagnosis.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-blue-600 font-bold text-lg mb-2">2</div>
              <h4 className="font-medium text-gray-800 mb-2">Track Symptoms</h4>
              <p className="text-sm text-gray-600">
                Keep a symptom diary noting when issues started, triggers, and what makes them better or worse.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-blue-600 font-bold text-lg mb-2">3</div>
              <h4 className="font-medium text-gray-800 mb-2">Regular Follow-ups</h4>
              <p className="text-sm text-gray-600">
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