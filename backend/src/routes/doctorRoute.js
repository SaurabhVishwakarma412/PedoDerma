// backend/routes/doctorRoute.js
const router = require("express").Router();
const {
  loginDoctor,
  getDoctors,
  getDoctorById,
  getDoctorAppointments,
  getDoctorStats
} = require("../controllers/doctorController");

// PUBLIC
router.get("/", getDoctors);
router.post("/login", loginDoctor);

// PROTECTED
router.get("/appointments", getDoctorAppointments);
router.get("/stats", getDoctorStats);

// keeping at last
router.get("/:id", getDoctorById);

module.exports = router;
