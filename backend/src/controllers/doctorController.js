// backend/controllers/doctorController.js
const bcrypt = require("bcryptjs");
const Doctor = require("../models/Doctor");
const generateToken = require("../utils/generateToken");

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
    const appointments = [
      {
        id: 1,
        patientName: "Sarah Miller",
        date: new Date().toISOString().split('T')[0],
        time: "10:00 AM",
        type: "video",
        reason: "Eczema flare-up",
        patientId: "PAT001"
      },
      {
        id: 2,
        patientName: "John Davis",
        date: new Date().toISOString().split('T')[0],
        time: "2:00 PM",
        type: "video",
        reason: "Acne consultation",
        patientId: "PAT002"
      }
    ];
    
    res.json(appointments);
  } catch (e) {
    console.error("GetDoctorAppointments ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get doctor stats (PROTECTED - doctor only)
exports.getDoctorStats = async (req, res) => {
  try {
    const stats = {
      totalCases: 45,
      pendingCases: 12,
      completedCases: 33,
      todayAppointments: 2,
      waitingPatients: 5,
      avgResponseTime: "2h 15m",
      patientSatisfaction: "4.8",
      monthlyGrowth: "+12%"
    };
    
    res.json(stats);
  } catch (e) {
    console.error("GetDoctorStats ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};