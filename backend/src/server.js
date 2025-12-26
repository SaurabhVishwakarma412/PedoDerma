require("dotenv").config({ quiet: true });
const http = require("http");
const socketIO = require("socket.io");
const connectDB = require("./config/db.js");
const Message = require("./models/Message");
const app = require("./app");

connectDB();

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
  }
});

// Store active connections
const userSockets = {};

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Store user socket
  socket.on("user_join", (userId) => {
    userSockets[userId] = socket.id;
    console.log(`User ${userId} joined with socket ${socket.id}`);
    console.log("Current online users:", Object.keys(userSockets));
  });

  // Handle sending messages
  socket.on("send_message", async (data) => {
    const { from, to, message, timestamp } = data;
    console.log(`Message received from ${from} to ${to}`);
    
    // Save message to database
    try {
      const newMessage = new Message({
        from,
        to,
        message,
        timestamp: new Date(timestamp)
      });
      await newMessage.save();
      console.log("Message saved to database");
    } catch (err) {
      console.error("Error saving message:", err);
    }
    
    // Send to recipient if online
    const recipientSocketId = userSockets[to];
    if (recipientSocketId) {
      console.log(`Sending message to recipient socket ${recipientSocketId}`);
      io.to(recipientSocketId).emit("receive_message", {
        from,
        message,
        timestamp,
        senderSocketId: socket.id
      });
    } else {
      console.log(`Recipient ${to} is not online. Message saved to DB.`);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (let userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
