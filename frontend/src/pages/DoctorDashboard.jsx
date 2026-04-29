import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Filter,
  Search,
  Bell,
  Calendar,
  Clock,
  MessageSquare,
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  FileText,
  TrendingUp,
  User,
  ChevronRight,
  Video,
  Plus,
  Download,
  Shield,
  AlertTriangle,
  Star,
  BarChart3,
  MessageCircle
} from "lucide-react";
import { getAllCases, getDoctorAppointments, getDoctorStats } from "../services/doctorAPI";
import CaseCard from "../components/CaseCard";

const DoctorDashboard = () => {
  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalCases: 0,
    pendingCases: 0,
    completedCases: 0,
    todayAppointments: 0,
    waitingPatients: 0,
    avgResponseTime: "2h 15m",
    patientSatisfaction: "4.8",
    monthlyGrowth: "+12%"
  });
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const casesRes = await getAllCases();
        const casesData = casesRes.data || [];
        setCases(casesData);

        const appointmentsRes = await getDoctorAppointments();
        const appointmentsData = appointmentsRes.data || [];
        setAppointments(appointmentsData);

        const statsRes = await getDoctorStats();
        const statsData = statsRes.data || {};

        const pendingCases = casesData.filter(c => c.status === "pending").length;
        const completedCases = casesData.filter(c => c.status === "completed").length;
        const todayAppointments = appointmentsData.filter(a => a.date === new Date().toISOString().split('T')[0]).length;

        setStats({
          totalCases: casesData.length,
          pendingCases,
          completedCases,
          todayAppointments,
          waitingPatients: appointmentsData.filter(a => a.status === "scheduled").length,
          avgResponseTime: statsData.avgResponseTime || "2h 15m",
          patientSatisfaction: statsData.patientSatisfaction || "4.8",
          monthlyGrowth: statsData.monthlyGrowth || "+12%"
        });

      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const filteredCases = cases.filter((c) => {
    const matchesFilter = filter === "all" ? true : c.status === filter;
    const matchesSearch =
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symptoms?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const urgentCases = cases.filter(c => {
    const caseTime = new Date(c.createdAt);
    const now = new Date();
    const hoursDiff = (now - caseTime) / (1000 * 60 * 60);
    return hoursDiff < 24 && c.status === "pending";
  });

  const todayAppointments = appointments.filter(a =>
    a.date === new Date().toISOString().split('T')[0]
  );

  const notifications = [
    { id: 1, type: 'urgent', message: '3 urgent cases waiting for review', time: '10 min ago' },
    { id: 2, type: 'appointment', message: 'Appointment with Sarah M. in 30 minutes', time: '1 hour ago' },
    { id: 3, type: 'message', message: 'New patient message received', time: '2 hours ago' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'in_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
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
  const StatCard = ({ label, value, change, gradient, icon }) => (
    <div className={`relative overflow-hidden rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      darkMode 
        ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50" 
        : `bg-gradient-to-br ${gradient}`
    }`}>
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white"></div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white`}>
          {icon}
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-white"}`}>{value}</div>
          {change && (
            <div className={`text-sm ${change.includes('+') ? 'text-green-300' : 'text-blue-300'}`}>
              {change}
            </div>
          )}
        </div>
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
                  <Stethoscope className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Welcome, Dr. Smith</h1>
                  <p className="text-blue-100">Pediatric Dermatology Specialist</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  License: ABC-123456
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  4.9/5 Rating (287 reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition backdrop-blur-sm">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    3
                  </span>
                </button>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2 backdrop-blur-sm">
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
                <button
                  onClick={() => navigate("/doctor/messages")}
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
        {/* Stats Dashboard */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              label="Total Cases" 
              value={stats.totalCases} 
              change={stats.monthlyGrowth}
              gradient="from-blue-500 to-blue-600"
              icon={<FileText className="w-6 h-6" />}
            />
            <StatCard 
              label="Pending Review" 
              value={stats.pendingCases} 
              change={urgentCases.length > 0 ? `${urgentCases.length} urgent` : null}
              gradient="from-yellow-500 to-orange-500"
              icon={<AlertCircle className="w-6 h-6" />}
            />
            <StatCard 
              label="Today's Appointments" 
              value={stats.todayAppointments} 
              change="Next in 30 min"
              gradient="from-purple-500 to-pink-500"
              icon={<Calendar className="w-6 h-6" />}
            />
            <StatCard 
              label="Patient Satisfaction" 
              value={stats.patientSatisfaction} 
              change="/5.0"
              gradient="from-green-500 to-emerald-500"
              icon={<Star className="w-6 h-6" />}
            />
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Cases & Review */}
          <div className="lg:col-span-2">
            {/* Cases Header with Filters */}
            <div className={`rounded-xl shadow-lg mb-6 p-6 transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50" 
                : "bg-white border border-gray-100"
            }`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h2 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                    <FileText className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                    Patient Cases
                  </h2>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Review and manage dermatology cases</p>
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search cases..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full transition-colors ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-200" 
                          : "bg-white border border-gray-300"
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <select
                      className={`rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-200" 
                          : "bg-white border border-gray-300"
                      }`}
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All Cases</option>
                      <option value="pending">Pending Review</option>
                      <option value="in_review">In Review</option>
                      <option value="completed">Completed</option>
                      <option value="urgent">Urgent (24h)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Urgent Cases Alert */}
              {urgentCases.length > 0 && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  darkMode 
                    ? "bg-red-900/20 border-red-800" 
                    : "bg-red-50 border-red-200"
                }`}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-5 h-5 ${darkMode ? "text-red-400" : "text-red-600"}`} />
                      <div>
                        <h4 className={`font-semibold ${darkMode ? "text-red-400" : "text-red-800"}`}>
                          {urgentCases.length} Urgent Cases Need Attention
                        </h4>
                        <p className={`text-sm ${darkMode ? "text-red-300" : "text-red-700"}`}>
                          These cases were submitted within the last 24 hours
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/cases/urgent"
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-lg hover:shadow-lg transition transform hover:scale-105"
                    >
                      Review Now
                    </Link>
                  </div>
                </div>
              )}

              {/* Cases Grid */}
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
              ) : filteredCases.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                  <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>No cases found</h3>
                  <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No cases match your current filters</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredCases.slice(0, 4).map((c) => (
                      <CaseCard
                        key={c._id}
                        caseData={c}
                        onClickOverride={() => navigate(`/cases/${c._id}/review`)}
                        showPriority={true}
                      />
                    ))}
                  </div>

                  {filteredCases.length > 4 && (
                    <div className="text-center pt-4">
                      <Link
                        to="/cases"
                        className={`inline-flex items-center gap-2 font-medium transition ${
                          darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                        }`}
                      >
                        View All Cases ({filteredCases.length})
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Today's Schedule */}
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50" 
                : "bg-white border border-gray-100"
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className={`w-5 h-5 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                  Today's Schedule
                </h3>
                <Link
                  to="/appointments"
                  className={`text-sm font-medium flex items-center gap-1 transition ${
                    darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                  <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                      darkMode 
                        ? "bg-gray-700/50 border border-gray-600 hover:bg-gray-700" 
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          darkMode ? "bg-blue-900/30" : "bg-blue-100"
                        }`}>
                          <User className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                        </div>
                        <div>
                          <h4 className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{apt.patientName}</h4>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{apt.reason}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm">
                            <span className={`flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              <Clock className="w-3 h-3" />
                              {apt.time}
                            </span>
                            {apt.type === 'video' && (
                              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                <Video className="w-3 h-3" />
                                Video Call
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:shadow-lg transition transform hover:scale-105">
                          Join
                        </button>
                        <Link
                          to={`/patient/${apt.patientId}`}
                          className={`text-sm font-medium transition ${
                            darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                          }`}
                        >
                          Chart
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <Link
                  to="/appointments/new"
                  className={`flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed rounded-lg transition ${
                    darkMode 
                      ? "border-gray-600 hover:border-blue-500 hover:bg-blue-900/20 text-gray-400 hover:text-blue-400" 
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add New Appointment
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Notifications & Analytics */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50" 
                : "bg-white border border-gray-100"
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                  <Bell className="w-5 h-5" />
                  Notifications
                </h3>
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  3 new
                </span>
              </div>

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg transition cursor-pointer ${
                      darkMode 
                        ? "bg-gray-700/50 border border-gray-600 hover:bg-gray-700" 
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-1 rounded ${
                        notification.type === 'urgent' ? darkMode ? 'bg-red-900/30' : 'bg-red-100' :
                        notification.type === 'appointment' ? darkMode ? 'bg-green-900/30' : 'bg-green-100' :
                        darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                      }`}>
                        {notification.type === 'urgent' ? (
                          <AlertCircle className={`w-4 h-4 ${darkMode ? "text-red-400" : "text-red-600"}`} />
                        ) : notification.type === 'appointment' ? (
                          <Calendar className={`w-4 h-4 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                        ) : (
                          <MessageSquare className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>{notification.message}</p>
                        <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50" 
                : "bg-white border border-gray-100"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                <BarChart3 className={`w-5 h-5 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Avg. Response Time</span>
                  <span className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{stats.avgResponseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Case Completion</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {stats.completedCases}/{stats.totalCases}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Patients Waiting</span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">{stats.waitingPatients}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Monthly Growth</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{stats.monthlyGrowth}</span>
                </div>
              </div>
            </div>

            {/* Common Conditions */}
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50" 
                : "bg-white border border-gray-100"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Common Conditions</h3>
              <div className="space-y-3">
                {[
                  { condition: "Atopic Dermatitis", cases: 12, trend: "up" },
                  { condition: "Acne Vulgaris", cases: 8, trend: "stable" },
                  { condition: "Contact Dermatitis", cases: 5, trend: "down" },
                  { condition: "Tinea Infections", cases: 4, trend: "up" },
                ].map((cond, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}>
                    <div>
                      <p className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{cond.condition}</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{cond.cases} cases this month</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      cond.trend === 'up' ? 'bg-green-900 text-green-800 dark:bg-green-900/30 dark:text-green-600' :
                      cond.trend === 'down' ? 'bg-red-900 text-red-800 dark:bg-red-900/30 dark:text-red-600' :
                      'bg-yellow-900 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-700'
                    }`}>
                      {cond.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support & Resources */}
            <div className={`rounded-xl p-6 transition-colors duration-300 ${
              darkMode 
                ? "bg-blue-900/20 border border-blue-800" 
                : "bg-blue-50 border border-blue-200"
            }`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Medical Resources</h3>
              <div className="space-y-3">
                <Link
                  to="/guidelines"
                  className={`block p-3 rounded-lg transition text-sm font-medium ${
                    darkMode 
                      ? "bg-gray-800/50 border border-gray-700 hover:bg-gray-800 text-blue-400" 
                      : "bg-white border border-blue-200 hover:bg-blue-50 text-blue-700"
                  }`}
                >
                  Clinical Guidelines
                </Link>
                <Link
                  to="/medications"
                  className={`block p-3 rounded-lg transition text-sm font-medium ${
                    darkMode 
                      ? "bg-gray-800/50 border border-gray-700 hover:bg-gray-800 text-blue-400" 
                      : "bg-white border border-blue-200 hover:bg-blue-50 text-blue-700"
                  }`}
                >
                  Pediatric Medications
                </Link>
                <Link
                  to="/training"
                  className={`block p-3 rounded-lg transition text-sm font-medium ${
                    darkMode 
                      ? "bg-gray-800/50 border border-gray-700 hover:bg-gray-800 text-blue-400" 
                      : "bg-white border border-blue-200 hover:bg-blue-50 text-blue-700"
                  }`}
                >
                  Platform Training
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency Tips */}
        <div className={`mt-8 rounded-xl p-6 transition-colors duration-300 ${
          darkMode 
            ? "bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-800/50" 
            : "bg-gradient-to-r from-indigo-50 to-purple-50"
        }`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            <TrendingUp className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
            Efficiency Tips
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg transition-all duration-300 hover:shadow-md ${
              darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white shadow-sm"
            }`}>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg mb-2 w-8 h-8 rounded-full flex items-center justify-center">1</div>
              <h4 className={`font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Batch Review</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Review similar cases together for consistent diagnoses and faster responses.
              </p>
            </div>
            <div className={`p-4 rounded-lg transition-all duration-300 hover:shadow-md ${
              darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white shadow-sm"
            }`}>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg mb-2 w-8 h-8 rounded-full flex items-center justify-center">2</div>
              <h4 className={`font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Template Responses</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Use pre-approved templates for common conditions to save time.
              </p>
            </div>
            <div className={`p-4 rounded-lg transition-all duration-300 hover:shadow-md ${
              darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white shadow-sm"
            }`}>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg mb-2 w-8 h-8 rounded-full flex items-center justify-center">3</div>
              <h4 className={`font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Follow-up Reminders</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Schedule automatic follow-up reminders for patients requiring check-ins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DoctorDashboard;