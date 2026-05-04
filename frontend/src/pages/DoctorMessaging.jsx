import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { 
  MessageSquare, Send, Phone, Video, MoreVertical, Search, ArrowLeft,
  Users, Clock, CheckCheck, Check, Smile, Paperclip, Mic, User,
  Star, Shield, Activity, Calendar, PhoneCall, VideoIcon, Circle,
  CircleOff, Award, Briefcase, Mail, MapPin
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api";

const DoctorMessaging = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dark mode observer
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setDarkMode(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  // Socket.io connection
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

    newSocket.on("user_online", (data) => {
      setOnlineStatus(prev => ({ ...prev, [data.userId]: true }));
    });

    newSocket.on("user_offline", (data) => {
      setOnlineStatus(prev => ({ ...prev, [data.userId]: false }));
    });

    newSocket.on("typing", (data) => {
      if (data.from === selectedPatient?._id) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });

    newSocket.on("receive_message", (data) => {
      console.log("Received message:", data);
      
      if (data.from === user._id) return;
      
      const isFromSelectedPatient = selectedPatient && 
        (data.from === selectedPatient._id || data.from === selectedPatient.userId);
      
      if (isFromSelectedPatient) {
        setMessages((prev) => {
          const isDuplicate = prev.some(msg => 
            msg.message === data.message && 
            Math.abs(new Date(msg.timestamp).getTime() - new Date(data.timestamp).getTime()) < 1000
          );
          
          if (!isDuplicate) {
            return [...prev, {
              from: data.from,
              message: data.message,
              timestamp: new Date(data.timestamp),
              isOwn: false,
              status: 'delivered'
            }];
          }
          return prev;
        });
      }

      setConversations(prev => {
        return prev.map(conv => {
          if (conv.patientInfo?.[0]?._id === data.from) {
            return {
              ...conv,
              lastMessage: data.message,
              unreadCount: (conv.unreadCount || 0) + 1,
              lastMessageTime: data.timestamp
            };
          }
          return conv;
        });
      });
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, selectedPatient]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/messages/doctor/conversations/${user._id}`, {
          headers: { "x-doctor-id": user._id }
        });
        const conversationsList = response.data.data || [];
        setConversations(conversationsList);
        setError("");
        if (conversationsList.length > 0 && conversationsList[0].patientInfo?.[0]) {
          setSelectedPatient(conversationsList[0].patientInfo[0]);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setError(error.response?.data?.message || error.message || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch chat history
  useEffect(() => {
    if (selectedPatient) {
      fetchChatHistory();
    }
  }, [selectedPatient]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/messages/doctor/chat/${selectedPatient._id}`, {
        headers: { "x-doctor-id": user._id }
      });
      
      const seenMessages = new Set();
      const formattedMessages = response.data.data
        .filter((msg) => {
          const messageKey = `${msg.message}_${new Date(msg.timestamp).getTime()}`;
          if (seenMessages.has(messageKey)) return false;
          seenMessages.add(messageKey);
          return true;
        })
        .map((msg) => ({
          ...msg,
          isOwn: msg.from === user._id || msg.from?._id === user._id,
          status: 'read'
        }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedPatient) return;

    const tempId = Date.now().toString();
    const messageData = {
      from: user._id,
      to: selectedPatient._id,
      message: messageInput,
      timestamp: new Date(),
      isOwn: true,
      tempId: tempId,
      status: 'sending'
    };

    setMessages((prev) => [...prev, messageData]);

    if (socket) {
      socket.emit("send_message", {
        from: user._id,
        to: selectedPatient._id,
        message: messageInput,
        timestamp: new Date(),
        tempId: tempId
      });
    }

    try {
      await API.post("/messages/send", {
        from: user._id,
        to: selectedPatient._id,
        message: messageInput
      });
      
      setMessages(prev => prev.map(msg => 
        msg.tempId === tempId ? { ...msg, status: 'delivered' } : msg
      ));
    } catch (error) {
      console.error("Error saving message:", error);
      setMessages(prev => prev.map(msg => 
        msg.tempId === tempId ? { ...msg, status: 'error' } : msg
      ));
    }

    setMessageInput("");
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    
    if (socket && selectedPatient && e.target.value.length > 0) {
      socket.emit("typing", {
        from: user._id,
        to: selectedPatient._id
      });
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.patientInfo?.[0]?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Conversation Card Component
  const ConversationCard = ({ conversation, isSelected, onClick }) => {
    const patient = conversation.patientInfo?.[0];
    if (!patient) return null;

    return (
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
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-lg font-semibold shadow-lg`}>
              {patient.name?.charAt(0) || "P"}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${
              darkMode ? "border-gray-800" : "border-white"
            } ${onlineStatus[patient._id] ? "bg-green-500" : "bg-gray-400"}`}></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold truncate ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                {patient.name}
              </h3>
              {conversation.lastMessageTime && (
                <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {new Date(conversation.lastMessageTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              )}
            </div>
            <p className={`text-sm truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {conversation.lastMessage}
            </p>
          </div>
          {conversation.unreadCount > 0 && (
            <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full animate-pulse">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </button>
    );
  };

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
              <h1 className="text-2xl md:text-3xl font-bold">Patient Messages</h1>
              <p className="text-blue-100">Manage conversations with your patients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className={`mb-6 p-4 rounded-lg border ${
            darkMode 
              ? "bg-red-900/20 border-red-800" 
              : "bg-red-50 border-red-200"
          }`}>
            <p className={darkMode ? "text-red-400" : "text-red-700"}>⚠️ {error}</p>
          </div>
        )}

        <div className={`rounded-xl shadow-xl overflow-hidden transition-colors duration-300 ${
          darkMode 
            ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50" 
            : "bg-white border border-gray-100"
        }`}>
          <div className="grid lg:grid-cols-3 h-[calc(100vh-200px)]">
            {/* Conversations List Sidebar */}
            <div className={`border-r ${darkMode ? "border-gray-700" : "border-gray-200"} flex flex-col`}>
              <div className="p-4 border-b dark:border-gray-700">
                <div className="relative">
                  <Search className={`absolute left-3 top-2.5 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                  <input
                    type="text"
                    placeholder="Search patients..."
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

              <div className="flex-1 overflow-y-auto">
                {loading && conversations.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className={`p-4 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"} inline-block mb-4`}>
                      <Users className={`w-12 h-12 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                    </div>
                    <p className={darkMode ? "text-gray-500" : "text-gray-500"}>No conversations yet</p>
                    <p className={`text-sm mt-2 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                      When patients message you, they'll appear here
                    </p>
                  </div>
                ) : (
                  <div>
                    {filteredConversations.map((conversation, index) => (
                      <ConversationCard
                        key={index}
                        conversation={conversation}
                        isSelected={selectedPatient?._id === conversation.patientInfo?.[0]?._id}
                        onClick={() => setSelectedPatient(conversation.patientInfo?.[0])}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            {selectedPatient ? (
              <div className="lg:col-span-2 flex flex-col h-full relative">
                {/* Chat Header */}
                <div className={`p-4 border-b ${darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50"} shrink-0`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedPatient(null)}
                        className="lg:hidden p-2 rounded-lg transition hover:bg-white/20"
                      >
                        <ArrowLeft className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                      </button>

                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-lg font-semibold shadow-lg`}>
                          {selectedPatient.name?.charAt(0) || "P"}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                          darkMode ? "border-gray-800" : "border-white"
                        } ${onlineStatus[selectedPatient._id] ? "bg-green-500" : "bg-gray-400"}`}></div>
                      </div>

                      <div>
                        <h2 className={`font-semibold text-lg ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                          {selectedPatient.name || "Unknown Patient"}
                        </h2>
                        <div className="flex items-center gap-2">
                          <Mail className={`w-3 h-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {selectedPatient.email || "No email"}
                          </p>
                        </div>
                        {isTyping && (
                          <p className="text-xs text-blue-500 animate-pulse mt-1">Patient is typing...</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className={`p-2 rounded-lg transition ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-white"
                      }`}>
                        <Phone className={`w-5 h-5 ${darkMode ? "text-green-400" : "text-green-600"}`} />
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
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loading && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className={`p-4 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"} mb-4`}>
                        <MessageSquare className={`w-12 h-12 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                      </div>
                      <h3 className={`font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>No messages yet</h3>
                      <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Start the conversation with {selectedPatient.name}
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, index) => (
                        <MessageBubble key={msg.tempId || msg._id || index} message={msg} />
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
                  <Users className={`w-16 h-16 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                </div>
                <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Select a patient to view conversation</p>
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

export default DoctorMessaging;