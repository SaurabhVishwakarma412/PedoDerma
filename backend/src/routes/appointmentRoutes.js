const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const Case = require("../models/Case");

// Get parent's appointments (PROTECTED - parent/patient only)
router.get("/", auth, role(["parent"]), async (req, res) => {
  try {
    const cases = await Case.find({ parentId: req.user._id, timeSlot: { $ne: null } }).populate("doctorId");
    const appointments = cases.map(c => ({
      id: c._id,
      doctorName: c.doctorId ? c.doctorId.name : "Dr. Saurabh Sharma",
      specialty: c.doctorId ? c.doctorId.specialization : "Dermatology",
      status: c.status === 'in_review' ? 'scheduled' : c.status,
      date: c.appointmentDate,
      time: c.timeSlot,
      type: c.visitType === 'online' ? 'video' : 'in_person',
      reason: c.title,
      patientId: c.parentId
    }));
    res.json(appointments);
  } catch (e) {
    console.error("GET appointments ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get upcoming appointments (PROTECTED - parent/patient only)
router.get("/upcoming", auth, role(["parent"]), async (req, res) => {
  try {
    const cases = await Case.find({ parentId: req.user._id, timeSlot: { $ne: null } }).populate("doctorId");
    const appointments = cases.map(c => ({
      id: c._id,
      doctorName: c.doctorId ? c.doctorId.name : "Dr. Saurabh Sharma",
      specialty: c.doctorId ? c.doctorId.specialization : "Dermatology",
      status: c.status === 'in_review' ? 'scheduled' : c.status,
      date: c.appointmentDate,
      time: c.timeSlot,
      type: c.visitType === 'online' ? 'video' : 'in_person',
      reason: c.title,
      patientId: c.parentId
    }));
    res.json(appointments);
  } catch (e) {
    console.error("GET upcoming appointments ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
