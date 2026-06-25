
import React, { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import { 
  MessageSquare, Send, Phone, Video, MoreVertical, Search, ArrowLeft, 
  Users, Clock, CheckCheck, Check, Smile, Paperclip, 
  Star, Award, Shield, CircleOff, Stethoscope, Plus
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api";
import { getMyCases } from "../services/patientAPI";

const MessagingPage = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [noCases, setNoCases] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingEmitTimeoutRef = useRef(null);
  const socketRef = useRef(null);
  const selectedDoctorRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    selectedDoctorRef.current = selectedDoctor;
  }, [selectedDoctor]);

  // Dark mode observer
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setDarkMode(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  // Initialize Socket.io connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      if (user) {
        newSocket.emit("user_join", user._id);
      }
    });

    newSocket.on("receive_message", (data) => {
      console.log("Received message:", data);
      setMessages((prev) => [...prev, {
        _id: Date.now(),
        from: data.from,
        message: data.message,
        timestamp: new Date(data.timestamp),
        isOwn: false,
        status: 'delivered'
      }]);
    });

    newSocket.on("user_online", (data) => {
      setOnlineStatus(prev => ({ ...prev, [data.userId]: true }));
    });

    newSocket.on("user_offline", (data) => {
      setOnlineStatus(prev => ({ ...prev, [data.userId]: false }));
    });

    newSocket.on("typing", (data) => {
      if (data.from === selectedDoctorRef.current?._id) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error);
    });

    socketRef.current = newSocket;

    return () => {
      socketRef.current = null;
      newSocket.disconnect();
      clearTimeout(typingTimeoutRef.current);
      clearTimeout(typingEmitTimeoutRef.current);
    };
  }, [user]);

  // Fetch only doctors from the patient's submitted cases (access control)
  useEffect(() => {
    const fetchAssignedDoctors = async () => {
      if (!user) return;
      setLoadingDoctors(true);
      try {
        // 1. Get the patient's cases
        const casesRes = await getMyCases();
        const cases = casesRes.data || [];

        if (cases.length === 0) {
          setNoCases(true);
          setDoctors([]);
          return;
        }

        // 2. Extract unique doctor IDs from cases that have a doctor assigned
        const assignedDoctorIds = [...new Set(
          cases
            .filter(c => c.doctorId)
            .map(c => typeof c.doctorId === 'object' ? c.doctorId._id : c.doctorId)
        )];

        if (assignedDoctorIds.length === 0) {
          // Patient has cases but no doctor assigned yet
          setNoCases(false);
          setDoctors([]);
          setError("No doctor has been assigned to your cases yet. Please wait for a doctor to review your case.");
          return;
        }

        // 3. Fetch all doctors and filter to assigned only
        const doctorsRes = await API.get("/messages/doctors");
        const allDoctors = doctorsRes.data.data || [];
        const assignedDoctors = allDoctors.filter(d =>
          assignedDoctorIds.includes(String(d._id))
        );

        setDoctors(assignedDoctors);
        setError("");

        if (assignedDoctors.length > 0) {
          setSelectedDoctor(assignedDoctors[0]);
        }
      } catch (err) {
        console.error("Error fetching assigned doctors:", err);
        setError("Failed to load your conversations. Please try again.");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchAssignedDoctors();
  }, [user]);

  const fetchChatHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get(`/messages/chat/${selectedDoctor._id}`, {
        headers: { "x-parent-id": user._id }
      });
      const formattedMessages = response.data.data.map((msg) => ({
        ...msg,
        isOwn: msg.from === user._id || msg.from?.toString() === user._id?.toString(),
        status: 'read'
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDoctor, user]);

  // Fetch chat history when a doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      fetchChatHistory();
    }
  }, [selectedDoctor, fetchChatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedDoctor) return;

    const tempId = Date.now();
    const messageData = {
      _id: tempId,
      from: user._id,
      to: selectedDoctor._id,
      message: messageInput,
      timestamp: new Date(),
      isOwn: true,
      status: 'sending'
    };

    setMessages((prev) => [...prev, messageData]);

    if (socketRef.current) {
      socketRef.current.emit("send_message", {
        from: user._id,
        to: selectedDoctor._id,
        message: messageInput,
        timestamp: new Date()
      });
    }

    try {
      await API.post("/messages/send", {
        from: user._id,
        to: selectedDoctor._id,
        message: messageInput
      });
      
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? { ...msg, status: 'delivered' } : msg
      ));
    } catch (error) {
      console.error("Error saving message:", error);
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? { ...msg, status: 'error' } : msg
      ));
    }

    setMessageInput("");
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setMessageInput(value);
    
    if (socketRef.current && selectedDoctor && value.length > 0) {
      clearTimeout(typingEmitTimeoutRef.current);
      typingEmitTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit("typing", {
          from: user._id,
          to: selectedDoctor._id
        });
      }, 300);
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMessageStatusIcon = (status) => {
    switch(status) {
      case 'sending': return <Clock className="w-3 h-3" />;
      case 'delivered': return <Check className="w-3 h-3" />;
      case 'read': return <CheckCheck className="w-3 h-3" />;
      case 'error': return <CircleOff className="w-3 h-3 text-red-500" />;
      default: return null;
    }
  };

  // Doctor Card Component
  const DoctorCard = ({ doctor, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left transition-all duration-300 ${
        isSelected
          ? darkMode 
            ? "bg-blue-900/30 border-l-4 border-blue-500" 
            : "bg-blue-50 border-l-4 border-blue-600"
          : darkMode
            ? "hover:bg-gray-700/50 border-l-4 border-transparent"
            : "hover:bg-gray-50 border-l-4 border-transparent"
      } ${darkMode ? "border-b border-gray-700" : "border-b border-gray-100"}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-semibold shadow-lg`}>
            {doctor.name?.charAt(0)}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${
            darkMode ? "border-gray-800" : "border-white"
          } ${onlineStatus[doctor._id] ? "bg-green-500" : "bg-gray-400"}`}></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold truncate ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            {doctor.name}
          </h3>
          <p className={`text-sm truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {doctor.specialization}
          </p>
        </div>
        {doctor.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {doctor.rating}
            </span>
          </div>
        )}
      </div>
    </button>
  );

  // Message Bubble Component
  const MessageBubble = ({ message }) => (
    <div className={`flex ${message.isOwn ? "justify-end" : "justify-start"} animate-fade-in-up`}>
      <div className={`max-w-xs lg:max-w-md relative ${
        message.isOwn ? "ml-auto" : "mr-auto"
      }`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            message.isOwn
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm"
              : darkMode
                ? "bg-gray-700 text-gray-200 rounded-bl-sm"
                : "bg-gray-100 text-gray-800 rounded-bl-sm"
          }`}
        >
          <p className="text-sm break-words">{message.message}</p>
          <div className={`flex items-center justify-end gap-1 mt-1 ${
            message.isOwn ? "text-blue-100" : darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            <span className="text-xs">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {message.isOwn && getMessageStatusIcon(message.status)}
          </div>
        </div>
      </div>
    </div>
  );

  // No cases state
  if (!loadingDoctors && noCases) {
    return (
      <main className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
      }`}>
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
                <p className="text-blue-100">Chat with your dermatology care team</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className={`inline-flex p-6 rounded-full mb-6 ${darkMode ? "bg-gray-800" : "bg-blue-50"}`}>
            <Stethoscope className={`w-16 h-16 ${darkMode ? "text-blue-400" : "text-blue-500"}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            Submit a Case to Start Chatting
          </h2>
          <p className={`text-base mb-8 max-w-md mx-auto ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            You can chat with a doctor once you've submitted a case and a doctor has been assigned to you.
          </p>
          <Link
            to="/cases/submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Submit Your First Case
          </Link>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Shield className={`w-4 h-4 ${darkMode ? "text-green-500" : "text-green-600"}`} />
            <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>All conversations are secure and private</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
              <p className="text-blue-100">Chat with your dermatology care team</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className={`mb-6 p-4 rounded-lg border ${
            darkMode 
              ? "bg-yellow-900/20 border-yellow-800" 
              : "bg-yellow-50 border-yellow-200"
          }`}>
            <p className={darkMode ? "text-yellow-400" : "text-yellow-700"}>ℹ️ {error}</p>
          </div>
        )}

        <div className={`rounded-xl shadow-xl overflow-hidden transition-colors duration-300 ${
          darkMode 
            ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50" 
            : "bg-white border border-gray-100"
        }`}>
          <div className="grid h-[calc(100vh-200px)] min-h-[520px] overflow-hidden lg:grid-cols-3">
            {/* Doctors List Sidebar */}
            <div className={`border-r ${darkMode ? "border-gray-700" : "border-gray-200"} flex h-full min-h-0 flex-col overflow-hidden`}>
              <div className="shrink-0 p-4 border-b dark:border-gray-700">
                <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Your Doctors
                </p>
                <div className="relative">
                  <Search className={`absolute left-3 top-2.5 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500" 
                        : "bg-gray-50 border border-gray-300"
                    }`}
                  />
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {loadingDoctors ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredDoctors.length === 0 ? (
                  <div className="p-8 text-center">
                    <Users className={`w-12 h-12 mx-auto mb-3 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                    <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                      {doctors.length === 0 
                        ? "No doctors assigned yet" 
                        : "No results found"}
                    </p>
                  </div>
                ) : (
                  <div>
                    {filteredDoctors.map((doctor) => (
                      <DoctorCard
                        key={doctor._id}
                        doctor={doctor}
                        isSelected={selectedDoctor?._id === doctor._id}
                        onClick={() => setSelectedDoctor(doctor)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            {selectedDoctor ? (
              <div className="relative flex h-full min-h-0 flex-col overflow-hidden lg:col-span-2">
                {/* Chat Header */}
                <div className={`p-4 border-b ${darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50"} shrink-0`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedDoctor(null)}
                        className="lg:hidden p-2 rounded-lg transition hover:bg-white/20"
                      >
                        <ArrowLeft className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                      </button>

                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-semibold shadow-lg`}>
                          {selectedDoctor.name?.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                          darkMode ? "border-gray-800" : "border-white"
                        } ${onlineStatus[selectedDoctor._id] ? "bg-green-500" : "bg-gray-400"}`}></div>
                      </div>

                      <div>
                        <h2 className={`font-semibold text-lg ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                          {selectedDoctor.name}
                        </h2>
                        <div className="flex items-center gap-2">
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {selectedDoctor.specialization}
                          </p>
                          <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>•</span>
                          <div className="flex items-center gap-1">
                            <Award className={`w-3 h-3 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                            <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Board Certified</span>
                          </div>
                        </div>
                        {isTyping && (
                          <p className="text-xs text-blue-500 animate-pulse mt-1">Typing...</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className={`p-2 rounded-lg transition ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-white"
                      }`}>
                        <Phone className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                      </button>
                      <button className={`p-2 rounded-lg transition ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-white"
                      }`}>
                        <Video className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                      </button>
                      <button className={`p-2 rounded-lg transition ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-white"
                      }`}>
                        <MoreVertical className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className={`p-4 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"} mb-4`}>
                        <MessageSquare className={`w-12 h-12 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                      </div>
                      <h3 className={`font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>No messages yet</h3>
                      <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Start the conversation with {selectedDoctor.name}</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, index) => (
                        <MessageBubble key={msg._id || index} message={msg} />
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className={`p-4 border-t ${darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"} shrink-0`}>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`p-2 rounded-lg transition ${
                        darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-white text-gray-500"
                      }`}
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className={`p-2 rounded-lg transition ${
                        darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-white text-gray-500"
                      }`}
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={handleTyping}
                      placeholder="Type your message..."
                      className={`flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500" 
                          : "bg-white border border-gray-300"
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        messageInput.trim()
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transform hover:scale-105"
                          : darkMode ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="lg:col-span-2 flex flex-col items-center justify-center">
                <div className={`p-6 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"} mb-4`}>
                  <MessageSquare className={`w-16 h-16 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                </div>
                <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Select a doctor to start chatting</p>
                <p className={`text-sm mt-2 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>Your messages are secure and encrypted</p>
                <div className="flex items-center gap-2 mt-4">
                  <Shield className={`w-4 h-4 ${darkMode ? "text-green-500" : "text-green-600"}`} />
                  <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>HIPAA Compliant</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
          }
        `}
      </style>
    </main>
  );
};

export default MessagingPage;
