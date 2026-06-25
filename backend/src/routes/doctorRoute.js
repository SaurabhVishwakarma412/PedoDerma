// backend/routes/doctorRoute.js
const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  loginDoctor,
  getDoctors,
  getDoctorById,
  getDoctorAppointments,
  getDoctorStats,
  getBookedSlots
} = require("../controllers/doctorController");

// PUBLIC
router.get("/", getDoctors);
router.post("/login", loginDoctor);

// PROTECTED
router.get("/appointments", auth, role(["doctor"]), getDoctorAppointments);
router.get("/stats", auth, role(["doctor"]), getDoctorStats);
router.get("/booked-slots", auth, role(["doctor"]), getBookedSlots);

// keeping at last
router.get("/:id", getDoctorById);

module.exports = router;
