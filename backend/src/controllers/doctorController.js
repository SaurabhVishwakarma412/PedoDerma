// backend/controllers/doctorController.js
const bcrypt = require("bcryptjs");
const Doctor = require("../models/Doctor");
const Case = require("../models/Case");
const generateToken = require("../utils/generateToken");

// Admin-only doctor provisioning. Doctor credentials are never accepted from
// the public registration endpoint.
exports.createDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({ message: "Name, email and a password of at least 6 characters are required" });
    }

    const existing = await Doctor.findOne({ email: email.trim().toLowerCase() });
    if (existing) return res.status(409).json({ message: "A doctor with this email already exists" });

    const doctor = await Doctor.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: await bcrypt.hash(password, 10),
      specialization: specialization?.trim() || "Dermatology",
    });

    res.status(201).json({
      message: "Doctor registered successfully",
      doctor: { _id: doctor._id, name: doctor.name, email: doctor.email, specialization: doctor.specialization, role: "doctor" },
    });
  } catch (e) {
    console.error("CreateDoctor ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

// Doctor login function
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find doctor by email
    const doctor = await Doctor.findOne({ email });
    
    if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Generate token and return
    const token = generateToken(doctor._id, "doctor");
    
    res.json({
      token,
      user: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: "doctor",
        specialization: doctor.specialization
      }
    });
  } catch (e) {
    console.error("LoginDoctor ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all doctors (PUBLIC - no auth required)
exports.getDoctors = async (req, res) => {
  try {
    const doctors = [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "Pediatric Dermatology",
        rating: 4.8,
        reviewCount: 145,
        experience: "12 years",
        location: "New York, NY",
        nextAvailable: "Today",
        consultationFee: 99,
        availability: "today,this_week,weekend",
        email: "dr.sarah@pediatricderm.com",
        phone: "+1 (555) 123-4567",
        languages: ["English", "Spanish"],
        education: "Johns Hopkins University",
        certification: "American Board of Dermatology"
      },
      {
        id: 2,
        name: "Dr. Michael Chen",
        specialty: "Pediatric Eczema Specialist",
        rating: 4.9,
        reviewCount: 203,
        experience: "15 years",
        location: "Los Angeles, CA",
        nextAvailable: "Tomorrow",
        consultationFee: 120,
        availability: "this_week",
        email: "dr.chen@pediatricderm.com",
        phone: "+1 (555) 987-6543",
        languages: ["English", "Mandarin"],
        education: "Stanford University",
        certification: "American Board of Dermatology"
      },
      {
        id: 3,
        name: "Dr. Priya Sharma",
        specialty: "Infant Skin Care",
        rating: 4.7,
        reviewCount: 98,
        experience: "8 years",
        location: "Chicago, IL",
        nextAvailable: "Today",
        consultationFee: 95,
        availability: "today,weekend",
        email: "dr.sharma@pediatricderm.com",
        phone: "+1 (555) 456-7890",
        languages: ["English", "Hindi"],
        education: "University of Chicago",
        certification: "American Board of Dermatology"
      },
      {
        id: 4,
        name: "Dr. Robert Kim",
        specialty: "Teen Dermatology",
        rating: 4.6,
        reviewCount: 167,
        experience: "10 years",
        location: "Miami, FL",
        nextAvailable: "This Week",
        consultationFee: 110,
        availability: "this_week",
        email: "dr.kim@pediatricderm.com",
        phone: "+1 (555) 234-5678",
        languages: ["English", "Korean"],
        education: "Harvard Medical School",
        certification: "American Board of Dermatology"
      },
      {
        id: 5,
        name: "Dr. Ananya Patel",
        specialty: "General Pediatric Dermatology",
        rating: 4.9,
        reviewCount: 189,
        experience: "14 years",
        location: "Seattle, WA",
        nextAvailable: "Today",
        consultationFee: 105,
        availability: "today,this_week,weekend",
        email: "dr.patel@pediatricderm.com",
        phone: "+1 (555) 345-6789",
        languages: ["English", "Gujarati"],
        education: "University of Washington",
        certification: "American Board of Dermatology"
      }
    ];
    
    res.json(doctors);
  } catch (e) {
    console.error("GetDoctors ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get single doctor by ID (PUBLIC)
exports.getDoctorById = async (req, res) => {
  try {
    const doctors = [
      // Same doctors array as above
    ];
    
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    
    res.json(doctor);
  } catch (e) {
    console.error("GetDoctorById ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get doctor appointments (PROTECTED - doctor only)
exports.getDoctorAppointments = async (req, res) => {
  try {
    const cases = await Case.find({ doctorId: req.user._id, timeSlot: { $ne: null } }).populate("parentId");
    const appointments = cases.map(c => ({
      id: c._id,
      patientName: c.patientName || (c.parentId ? c.parentId.name : "Patient"),
      date: c.appointmentDate,
      time: c.timeSlot,
      type: c.visitType === 'online' ? 'video' : 'in_person',
      reason: c.title,
      patientId: c.parentId ? c.parentId._id : null,
      status: c.status === 'in_review' ? 'scheduled' : c.status
    }));
    res.json(appointments);
  } catch (e) {
    console.error("GetDoctorAppointments ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get doctor stats (PROTECTED - doctor only)
exports.getDoctorStats = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const totalCases = await Case.countDocuments({ doctorId });
    const pendingCases = await Case.countDocuments({ status: "pending" });
    const completedCases = await Case.countDocuments({ doctorId, status: "completed" });
    const appointments = await Case.find({ doctorId, timeSlot: { $ne: null } });
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.appointmentDate === todayStr).length;
    const waitingPatients = appointments.filter(a => a.status === "in_review").length;

    const stats = {
      totalCases,
      pendingCases,
      completedCases,
      todayAppointments,
      waitingPatients,
      avgResponseTime: "1h 45m",
      patientSatisfaction: "4.9",
      monthlyGrowth: "+15%"
    };
    
    res.json(stats);
  } catch (e) {
    console.error("GetDoctorStats ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get booked slots for date (PROTECTED - doctor only)
exports.getBookedSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }
    const bookedCases = await Case.find({
      doctorId: req.user._id,
      appointmentDate: date,
      timeSlot: { $ne: null }
    });
    const bookedSlots = bookedCases.map(c => c.timeSlot);
    res.json(bookedSlots);
  } catch (e) {
    console.error("GetBookedSlots ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};
