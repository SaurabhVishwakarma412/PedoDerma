// import React, { useEffect, useState, useContext } from "react";
// import { io } from "socket.io-client";
// import { MessageSquare, Send, Phone, Video, MoreVertical, Search, ArrowLeft } from "lucide-react";
// import { useAuth } from "../context/AuthContext.jsx";
// import API from "../services/api";

// const MessagingPage = () => {
//   const { user } = useAuth();
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [socket, setSocket] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [error, setError] = useState("");

//   // Initialize Socket.io connection
//   useEffect(() => {
//     const newSocket = io("http://localhost:5000", {
//       reconnection: true,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 5000,
//       reconnectionAttempts: 5
//     });

//     newSocket.on("connect", () => {
//       console.log("Connected to socket server with socket ID:", newSocket.id);
//       if (user) {
//         console.log("Emitting user_join for user:", user._id);
//         newSocket.emit("user_join", user._id);
//       }
//     });

//     newSocket.on("receive_message", (data) => {
//       console.log("Received message:", data);
//       setMessages((prev) => [...prev, {
//         from: data.from,
//         message: data.message,
//         timestamp: new Date(data.timestamp),
//         isOwn: false
//       }]);
//     });

//     newSocket.on("disconnect", () => {
//       console.log("Disconnected from socket server");
//     });

//     newSocket.on("connect_error", (error) => {
//       console.error("Socket.io connection error:", error);
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [user]);

//   // Fetch all doctors
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         console.log("Fetching doctors...");
//         console.log("Token:", localStorage.getItem("token"));
//         const response = await API.get("/messages/doctors");
//         console.log("Doctors response:", response.data);
//         const doctorsList = response.data.data || [];
//         setDoctors(doctorsList);
//         setError("");
        
//         // Auto-select the first (and only) doctor
//         if (doctorsList.length > 0) {
//           console.log("Auto-selecting doctor:", doctorsList[0]);
//           setSelectedDoctor(doctorsList[0]);
//         } else {
//           setError("No doctors available");
//         }
//       } catch (error) {
//         console.error("Error fetching doctors:", error);
//         console.error("Error response:", error.response);
//         setError(error.response?.data?.message || error.message || "Failed to load doctors");
//       }
//     };

//     if (user) {
//       fetchDoctors();
//     }
//   }, [user]);

//   // Fetch chat history when a doctor is selected
//   useEffect(() => {
//     if (selectedDoctor) {
//       fetchChatHistory();
//     }
//   }, [selectedDoctor]);

//   const fetchChatHistory = async () => {
//     try {
//       setLoading(true);
//       const response = await API.get(`/messages/chat/${selectedDoctor._id}`, {
//         headers: {
//           "x-parent-id": user._id
//         }
//       });
//       const formattedMessages = response.data.data.map((msg) => ({
//         ...msg,
//         isOwn: msg.from === user._id
//       }));
//       setMessages(formattedMessages);
//     } catch (error) {
//       console.error("Error fetching chat history:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!messageInput.trim() || !selectedDoctor) return;

//     const messageData = {
//       from: user._id,
//       to: selectedDoctor._id,
//       message: messageInput,
//       timestamp: new Date()
//     };

//     console.log("Sending message:", messageData);
//     console.log("Socket connected:", socket?.connected);

//     // Add message to local state immediately
//     setMessages((prev) => [...prev, {
//       ...messageData,
//       isOwn: true
//     }]);

//     // Send via Socket.io
//     if (socket) {
//       console.log("Emitting send_message event via Socket.io");
//       socket.emit("send_message", messageData);
//     } else {
//       console.error("Socket is not initialized!");
//     }

//     // Save to database (backup)
//     try {
//       console.log("Saving message via API...");
//       await API.post("/messages/send", {
//         from: user._id,
//         to: selectedDoctor._id,
//         message: messageInput
//       });
//       console.log("Message saved via API");
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }

//     setMessageInput("");
//   };

//   const filteredDoctors = doctors.filter(
//     (doctor) =>
//       doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <main className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex items-center gap-3">
//             <MessageSquare className="w-8 h-8" />
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
//               <p className="text-blue-100">Chat with your doctors</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-6">
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-700">⚠️ {error}</p>
//           </div>
//         )}
//         <div className="grid lg:grid-cols-3 gap-6 h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
//           {/* Doctors List */}
//           <div className="border-r border-gray-200 flex flex-col">
//             <div className="p-4 border-b border-gray-200">
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search doctors..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                 />
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {filteredDoctors.length === 0 ? (
//                 <div className="p-4 text-center text-gray-500">
//                   <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
//                   <p>No doctors available</p>
//                 </div>
//               ) : (
//                 <div>
//                   {filteredDoctors.map((doctor) => (
//                     <button
//                       key={doctor._id}
//                       onClick={() => setSelectedDoctor(doctor)}
//                       className={`w-full p-4 text-left border-b border-gray-100 hover:bg-blue-50 transition ${
//                         selectedDoctor?._id === doctor._id ? "bg-blue-100" : ""
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center">
//                           {doctor.name.charAt(0)}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h3 className="font-medium text-gray-800 truncate">
//                             {doctor.name}
//                           </h3>
//                           <p className="text-sm text-gray-500 truncate">
//                             {doctor.specialization}
//                           </p>
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Chat Area */}
//           {selectedDoctor ? (
//             <div className="lg:col-span-2 flex flex-col h-[calc(100vh-120px)] relative bg-white">
//               <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => setSelectedDoctor(null)}
//                     className="lg:hidden p-2 hover:bg-white rounded-lg"
//                   >
//                     <ArrowLeft className="w-5 h-5" />
//                   </button>

//                   <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center">
//                     {selectedDoctor.name.charAt(0)}
//                   </div>

//                   <div>
//                     <h2 className="font-semibold text-gray-800">
//                       {selectedDoctor.name}
//                     </h2>
//                     <p className="text-sm text-gray-600">
//                       {selectedDoctor.specialization}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <button className="p-2 hover:bg-white rounded-lg">
//                     <Phone className="w-5 h-5 text-blue-600" />
//                   </button>
//                   <button className="p-2 hover:bg-white rounded-lg">
//                     <Video className="w-5 h-5 text-blue-600" />
//                   </button>
//                   <button className="p-2 hover:bg-white rounded-lg">
//                     <MoreVertical className="w-5 h-5 text-gray-600" />
//                   </button>
//                 </div>
//               </div>

//               <div className="flex-1 overflow-y-auto p-4 bg-white pb-28">
//                 {loading ? (
//                   <div className="flex justify-center items-center h-full">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                   </div>
//                 ) : messages.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full text-gray-500">
//                     <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
//                     <p>No messages yet. Start the conversation!</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {messages.map((msg, index) => (
//                       <div
//                         key={index}
//                         className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
//                       >
//                         <div
//                           className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                             msg.isOwn
//                               ? "bg-blue-600 text-white rounded-br-none"
//                               : "bg-gray-200 text-gray-800 rounded-bl-none"
//                           }`}
//                         >
//                           <p>{msg.message}</p>
//                           <p
//                             className={`text-xs mt-1 ${
//                               msg.isOwn ? "text-blue-100" : "text-gray-500"
//                             }`}
//                           >
//                             {new Date(msg.timestamp).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <form
//                 onSubmit={handleSendMessage}
//                 className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50 flex gap-2"
//               >
//                 <input
//                   type="text"
//                   value={messageInput}
//                   onChange={(e) => setMessageInput(e.target.value)}
//                   placeholder="Type your message..."
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                 />
//                 <button
//                   type="submit"
//                   disabled={!messageInput.trim()}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
//                 >
//                   <Send className="w-5 h-5" />
//                 </button>
//               </form>
//             </div>
//           ) : (
//             <div className="lg:col-span-2 flex flex-col items-center justify-center text-gray-500 h-full">
//               <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
//               <p className="text-lg">Select a doctor to start chatting</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// };

// export default MessagingPage;

import React, { useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import { 
  MessageSquare, Send, Phone, Video, MoreVertical, Search, ArrowLeft, 
  Users, Clock, CheckCheck, Check, Smile, Paperclip, Mic, 
  PhoneCall, VideoIcon, Star, Award, Shield, Circle, CircleOff
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api";

const MessagingPage = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
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

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
      if (data.from === selectedDoctor?._id) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await API.get("/messages/doctors");
        const doctorsList = response.data.data || [];
        setDoctors(doctorsList);
        setError("");
        
        if (doctorsList.length > 0) {
          setSelectedDoctor(doctorsList[0]);
        } else {
          setError("No doctors available");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError(error.response?.data?.message || error.message || "Failed to load doctors");
      }
    };

    if (user) {
      fetchDoctors();
    }
  }, [user]);

  // Fetch chat history when a doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      fetchChatHistory();
    }
  }, [selectedDoctor]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/messages/chat/${selectedDoctor._id}`, {
        headers: { "x-parent-id": user._id }
      });
      const formattedMessages = response.data.data.map((msg) => ({
        ...msg,
        isOwn: msg.from === user._id,
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

    if (socket) {
      socket.emit("send_message", {
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
    setMessageInput(e.target.value);
    
    if (socket && selectedDoctor && e.target.value.length > 0) {
      socket.emit("typing", {
        from: user._id,
        to: selectedDoctor._id
      });
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
              <p className="text-blue-100">Chat with your pediatric dermatology team</p>
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
            {/* Doctors List Sidebar */}
            <div className={`border-r ${darkMode ? "border-gray-700" : "border-gray-200"} flex flex-col`}>
              <div className="p-4 border-b dark:border-gray-700">
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

              <div className="flex-1 overflow-y-auto">
                {filteredDoctors.length === 0 ? (
                  <div className="p-8 text-center">
                    <Users className={`w-12 h-12 mx-auto mb-3 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                    <p className={darkMode ? "text-gray-500" : "text-gray-500"}>No doctors available</p>
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
              <div className="lg:col-span-2 flex flex-col h-full relative">
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
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
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