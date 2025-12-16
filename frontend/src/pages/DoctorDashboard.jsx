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
  BarChart3
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch cases
        const casesRes = await getAllCases();
        const casesData = casesRes.data || [];
        setCases(casesData);

        // Fetch appointments
        const appointmentsRes = await getDoctorAppointments();
        const appointmentsData = appointmentsRes.data || [];
        setAppointments(appointmentsData);

        // Fetch doctor stats
        const statsRes = await getDoctorStats();
        const statsData = statsRes.data || {};
        
        // Calculate stats
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

  // Filter and search cases
  const filteredCases = cases.filter((c) => {
    const matchesFilter = filter === "all" ? true : c.status === filter;
    const matchesSearch = 
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symptoms?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get urgent cases (less than 24 hours old)
  const urgentCases = cases.filter(c => {
    const caseTime = new Date(c.createdAt);
    const now = new Date();
    const hoursDiff = (now - caseTime) / (1000 * 60 * 60);
    return hoursDiff < 24 && c.status === "pending";
  });

  // Get today's appointments
  const todayAppointments = appointments.filter(a => 
    a.date === new Date().toISOString().split('T')[0]
  );

  const notifications = [
    { id: 1, type: 'urgent', message: '3 urgent cases waiting for review', time: '10 min ago' },
    { id: 2, type: 'appointment', message: 'Appointment with Sarah M. in 30 minutes', time: '1 hour ago' },
    { id: 3, type: 'message', message: 'New patient message received', time: '2 hours ago' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6" />
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
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:opacity-90 transition flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Start Consult
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
            {[
              { 
                label: "Total Cases", 
                value: stats.totalCases, 
                change: stats.monthlyGrowth,
                color: "bg-blue-500",
                icon: <FileText className="w-6 h-6" />
              },
              { 
                label: "Pending Review", 
                value: stats.pendingCases, 
                change: urgentCases.length > 0 ? `${urgentCases.length} urgent` : null,
                color: "bg-yellow-500",
                icon: <AlertCircle className="w-6 h-6" />
              },
              { 
                label: "Today's Appointments", 
                value: stats.todayAppointments, 
                change: "Next in 30 min",
                color: "bg-purple-500",
                icon: <Calendar className="w-6 h-6" />
              },
              { 
                label: "Patient Satisfaction", 
                value: stats.patientSatisfaction, 
                change: "/5.0",
                color: "bg-green-500",
                icon: <Star className="w-6 h-6" />
              },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    {stat.change && (
                      <div className={`text-sm ${stat.change.includes('+') ? 'text-green-600' : 'text-blue-600'}`}>
                        {stat.change}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Cases & Review */}
          <div className="lg:col-span-2">
            {/* Cases Header with Filters */}
            <div className="bg-white rounded-xl shadow-lg mb-6 p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Patient Cases
                  </h2>
                  <p className="text-sm text-gray-500">Review and manage dermatology cases</p>
                </div>
                
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search cases..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                    />
                  </div>

                  {/* Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div>
                        <h4 className="font-semibold text-red-800">
                          {urgentCases.length} Urgent Cases Need Attention
                        </h4>
                        <p className="text-sm text-red-700">
                          These cases were submitted within the last 24 hours
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/cases/urgent"
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
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
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No cases found</h3>
                  <p className="text-gray-500">No cases match your current filters</p>
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
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
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
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Today's Schedule
                </h3>
                <Link
                  to="/appointments"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{apt.patientName}</h4>
                          <p className="text-sm text-gray-500">{apt.reason}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {apt.time}
                            </span>
                            {apt.type === 'video' && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <Video className="w-3 h-3" />
                                Video Call
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                          Join
                        </button>
                        <Link
                          to={`/patient/${apt.patientId}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Chart
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Add Appointment */}
              <div className="mt-6 pt-6 border-t">
                <Link
                  to="/appointments/new"
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-gray-600 hover:text-blue-600"
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
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h3>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  3 new
                </span>
              </div>
              
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-1 rounded ${
                        notification.type === 'urgent' ? 'bg-red-100' :
                        notification.type === 'appointment' ? 'bg-green-100' :
                        'bg-blue-100'
                      }`}>
                        {notification.type === 'urgent' ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : notification.type === 'appointment' ? (
                          <Calendar className="w-4 h-4" />
                        ) : (
                          <MessageSquare className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg. Response Time</span>
                  <span className="font-semibold text-gray-800">{stats.avgResponseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Case Completion</span>
                  <span className="font-semibold text-green-600">
                    {stats.completedCases}/{stats.totalCases}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Patients Waiting</span>
                  <span className="font-semibold text-yellow-600">{stats.waitingPatients}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monthly Growth</span>
                  <span className="font-semibold text-blue-600">{stats.monthlyGrowth}</span>
                </div>
              </div>
            </div>

            {/* Common Conditions */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Common Conditions</h3>
              <div className="space-y-3">
                {[
                  { condition: "Atopic Dermatitis", cases: 12, trend: "up" },
                  { condition: "Acne Vulgaris", cases: 8, trend: "stable" },
                  { condition: "Contact Dermatitis", cases: 5, trend: "down" },
                  { condition: "Tinea Infections", cases: 4, trend: "up" },
                ].map((cond, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{cond.condition}</p>
                      <p className="text-sm text-gray-500">{cond.cases} cases this month</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      cond.trend === 'up' ? 'bg-green-100 text-green-800' :
                      cond.trend === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cond.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/cases/new"
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition flex flex-col items-center justify-center"
                >
                  <Plus className="w-5 h-5 mb-1" />
                  <span className="text-xs">New Case</span>
                </Link>
                <Link
                  to="/appointments/new"
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition flex flex-col items-center justify-center"
                >
                  <Calendar className="w-5 h-5 mb-1" />
                  <span className="text-xs">Add Appt</span>
                </Link>
                <Link
                  to="/messages"
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition flex flex-col items-center justify-center"
                >
                  <MessageSquare className="w-5 h-5 mb-1" />
                  <span className="text-xs">Messages</span>
                </Link>
                <Link
                  to="/reports"
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition flex flex-col items-center justify-center"
                >
                  <Download className="w-5 h-5 mb-1" />
                  <span className="text-xs">Reports</span>
                </Link>
              </div>
            </div>

            {/* Support & Resources */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-3">Medical Resources</h3>
              <div className="space-y-3">
                <Link
                  to="/guidelines"
                  className="block p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition text-sm font-medium text-blue-700"
                >
                  Clinical Guidelines
                </Link>
                <Link
                  to="/medications"
                  className="block p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition text-sm font-medium text-blue-700"
                >
                  Pediatric Medications
                </Link>
                <Link
                  to="/training"
                  className="block p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition text-sm font-medium text-blue-700"
                >
                  Platform Training
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Efficiency Tips
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-blue-600 font-bold text-lg mb-2">1</div>
              <h4 className="font-medium text-gray-800 mb-2">Batch Review</h4>
              <p className="text-sm text-gray-600">
                Review similar cases together for consistent diagnoses and faster responses.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-blue-600 font-bold text-lg mb-2">2</div>
              <h4 className="font-medium text-gray-800 mb-2">Template Responses</h4>
              <p className="text-sm text-gray-600">
                Use pre-approved templates for common conditions to save time.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-blue-600 font-bold text-lg mb-2">3</div>
              <h4 className="font-medium text-gray-800 mb-2">Follow-up Reminders</h4>
              <p className="text-sm text-gray-600">
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