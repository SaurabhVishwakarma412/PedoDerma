import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MessageSquare, Send, Phone, Video, MoreVertical, Search, ArrowLeft } from "lucide-react";
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

  // Initialize Socket.io connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on("connect", () => {
      console.log("✅ Doctor connected to socket server with socket ID:", newSocket.id);
      if (user) {
        console.log("🔗 Doctor emitting user_join for user:", user._id);
        newSocket.emit("user_join", user._id);
      }
    });

    newSocket.on("receive_message", (data) => {
      console.log("📨 Doctor received message:", data);
      
      // Add message to current chat if viewing that patient
      setMessages((prev) => [...prev, {
        from: data.from,
        message: data.message,
        timestamp: new Date(data.timestamp),
        isOwn: false
      }]);

      // Refetch conversations to show new message in list
      setLoading(true);
      API.get(`/messages/doctor/conversations/${user._id}`, {
        headers: {
          "x-doctor-id": user._id
        }
      })
        .then(res => setConversations(res.data.data || []))
        .catch(err => console.error("Error refetching conversations:", err))
        .finally(() => setLoading(false));
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Doctor disconnected from socket server");
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Doctor Socket.io connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Fetch all conversations (patients)
  useEffect(() => {
    if (user) {
      fetchConversations();
      
      // Auto-refresh conversations every 5 seconds
      const interval = setInterval(() => {
        fetchConversations();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/messages/doctor/conversations/${user._id}`, {
        headers: {
          "x-doctor-id": user._id
        }
      });
      setConversations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat history when a patient is selected
  useEffect(() => {
    if (selectedPatient) {
      fetchChatHistory();
    }
  }, [selectedPatient]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/messages/doctor/chat/${selectedPatient._id}`, {
        headers: {
          "x-doctor-id": user._id
        }
      });
      const formattedMessages = response.data.data.map((msg) => {
        console.log("Message from API:", msg);
        const isOwn = msg.from === user._id || msg.from?._id === user._id;
        return {
          ...msg,
          isOwn: isOwn
        };
      });
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

    const messageData = {
      from: user._id,
      to: selectedPatient._id,
      message: messageInput,
      timestamp: new Date()
    };

    // Add message to local state immediately
    setMessages((prev) => [...prev, {
      ...messageData,
      isOwn: true
    }]);

    // Send via Socket.io
    if (socket) {
      socket.emit("send_message", messageData);
    }

    // Save to database (backup)
    try {
      await API.post("/messages/send", {
        from: user._id,
        to: selectedPatient._id,
        message: messageInput
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }

    setMessageInput("");
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.patientInfo?.[0]?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Patient Messages</h1>
              <p className="text-blue-100">Manage conversations with your patients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Conversations List */}
          <div className="border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                <div>
                  {filteredConversations.map((conversation, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPatient(conversation.patientInfo?.[0])}
                      className={`w-full p-4 text-left border-b border-gray-100 hover:bg-blue-50 transition ${
                        selectedPatient?._id === conversation.patientInfo?.[0]?._id
                          ? "bg-blue-100"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-green-500 to-emerald-600 text-white flex items-center justify-center">
                          {conversation.patientInfo?.[0]?.name?.charAt(0) || "P"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 truncate">
                            {conversation.patientInfo?.[0]?.name || "Unknown Patient"}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedPatient ? (
            <div className="lg:col-span-2 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-linear-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="lg:hidden p-2 hover:bg-white rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-green-500 to-emerald-600 text-white flex items-center justify-center">
                    {selectedPatient.name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {selectedPatient.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedPatient.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white rounded-lg transition">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-white rounded-lg transition">
                    <Video className="w-5 h-5 text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-white rounded-lg transition">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-white">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.isOwn
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-gray-200 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          <p>{msg.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.isOwn ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2"
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-gray-500">
              <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">Select a patient to view conversation</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DoctorMessaging;
