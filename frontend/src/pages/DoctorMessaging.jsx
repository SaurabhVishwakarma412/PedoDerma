import React, { useEffect, useState, useRef } from "react";
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
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize Socket.io connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server with socket ID:", newSocket.id);
      if (user) {
        console.log("Emitting user_join for user:", user._id);
        newSocket.emit("user_join", user._id);
      }
    });

    newSocket.on("receive_message", (data) => {
      console.log("Received message:", data);
      
      // FILTER OUT ECHOED MESSAGES - This is the key fix
      if (data.from === user._id) {
        console.log("Ignoring echoed message from self");
        return;
      }
      
      // Check if this is from the currently selected patient
      const isFromSelectedPatient = selectedPatient && 
        (data.from === selectedPatient._id || data.from === selectedPatient.userId);
      
      if (isFromSelectedPatient) {
        // Check for duplicate messages before adding
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
              isOwn: false
            }];
          }
          return prev;
        });
      }

      // Update conversation list without refetching chat history
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

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, selectedPatient]);

  // Fetch all conversations (patients)
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        console.log("Fetching conversations...");
        const response = await API.get(`/messages/doctor/conversations/${user._id}`, {
          headers: {
            "x-doctor-id": user._id
          }
        });
        console.log("Conversations response:", response.data);
        const conversationsList = response.data.data || [];
        setConversations(conversationsList);
        setError("");
        
        // Auto-select the first conversation if available
        if (conversationsList.length > 0 && conversationsList[0].patientInfo?.[0]) {
          console.log("Auto-selecting patient:", conversationsList[0].patientInfo[0]);
          setSelectedPatient(conversationsList[0].patientInfo[0]);
        } else if (conversationsList.length > 0) {
          setError("No patients available in conversations");
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        console.error("Error response:", error.response);
        setError(error.response?.data?.message || error.message || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

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
      
      // Remove potential duplicates
      const seenMessages = new Set();
      const formattedMessages = response.data.data
        .filter((msg) => {
          // Create a unique key for each message
          const messageKey = `${msg.message}_${new Date(msg.timestamp).getTime()}`;
          if (seenMessages.has(messageKey)) {
            return false;
          }
          seenMessages.add(messageKey);
          return true;
        })
        .map((msg) => {
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

    console.log("Sending message:", messageData);
    console.log("Socket connected:", socket?.connected);

    // Create unique ID to track this message
    const tempId = Date.now().toString();

    // Add message to local state immediately with temp ID
    setMessages((prev) => [...prev, {
      ...messageData,
      isOwn: true,
      tempId: tempId
    }]);

    // Send via Socket.io
    if (socket) {
      console.log("Emitting send_message event via Socket.io");
      socket.emit("send_message", {
        ...messageData,
        tempId: tempId
      });
    } else {
      console.error("Socket is not initialized!");
    }

    // Save to database (backup)
    try {
      console.log("Saving message via API...");
      await API.post("/messages/send", {
        from: user._id,
        to: selectedPatient._id,
        message: messageInput
      });
      console.log("Message saved via API");
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
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
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">⚠️ {error}</p>
          </div>
        )}
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
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center justify-center">
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
            <div className="lg:col-span-2 flex flex-col h-[calc(100vh-120px)] relative bg-white">
              {/* ================= CHAT HEADER ================= */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="lg:hidden p-2 hover:bg-white rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center justify-center">
                    {selectedPatient.name?.charAt(0) || "P"}
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {selectedPatient.name || "Unknown Patient"}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedPatient.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-white rounded-lg">
                    <Video className="w-5 h-5 text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-white rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* ================= MESSAGES AREA ================= */}
              <div className="flex-1 overflow-y-auto p-4 bg-white pb-28">
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
                        key={msg.tempId || msg._id || index}
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
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* ================= INPUT (FIXED BOTTOM) ================= */}
              <form
                onSubmit={handleSendMessage}
                className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50 flex gap-2"
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
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-gray-500 h-full">
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