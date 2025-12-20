const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const Doctor = require("../models/Doctor");

// Get all doctors (for parent to choose from)
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().select("_id name specialization");
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get chat history between parent and doctor
router.get("/chat/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    // Get parentId from headers or session - since using mock tokens, accept from client
    const parentId = req.headers["x-parent-id"];
    
    if (!parentId) {
      return res.status(400).json({ success: false, message: "Parent ID required" });
    }

    const messages = await Message.find({
      $or: [
        { from: parentId, to: doctorId },
        { from: doctorId, to: parentId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Save a message (backup in case socket fails)
router.post("/send", async (req, res) => {
  try {
    const { to, message, from } = req.body;
    
    if (!from || !to || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newMessage = new Message({
      from,
      to,
      message,
      timestamp: new Date()
    });

    await newMessage.save();
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark messages as read
router.put("/mark-read/:doctorId", authMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const parentId = req.user.id;

    await Message.updateMany(
      { from: doctorId, to: parentId, read: false },
      { read: true }
    );

    res.status(200).json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all conversations for a doctor (grouped by patient)
router.get("/doctor/conversations/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const mongoose = require("mongoose");
    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

    console.log(`📋 Fetching conversations for doctor: ${doctorId}`);

    // Get all unique patients who messaged this doctor
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: doctorObjectId },
            { to: doctorObjectId }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$from", doctorObjectId] },
              "$to",
              "$from"
            ]
          },
          lastMessage: { $last: "$message" },
          lastMessageTime: { $last: "$timestamp" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $ne: ["$read", true] },
                  { $eq: ["$to", doctorObjectId] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { lastMessageTime: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "patientInfo"
        }
      }
    ]);

    console.log(`✅ Found ${conversations.length} conversations:`, JSON.stringify(conversations, null, 2));

    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    console.error("❌ Error fetching conversations:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get chat history between doctor and specific patient
router.get("/doctor/chat/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    // Get doctorId from headers
    const doctorId = req.headers["x-doctor-id"];
    
    if (!doctorId) {
      return res.status(400).json({ success: false, message: "Doctor ID required" });
    }

    console.log(`💬 Fetching chat between doctor ${doctorId} and patient ${patientId}`);

    const messages = await Message.find({
      $or: [
        { from: doctorId, to: patientId },
        { from: patientId, to: doctorId }
      ]
    }).sort({ timestamp: 1 });

    console.log(`✅ Found ${messages.length} messages`);

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("❌ Error fetching chat:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
