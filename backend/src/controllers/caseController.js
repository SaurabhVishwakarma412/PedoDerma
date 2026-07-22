// backend/src/controllers/caseController.js
const Case = require("../models/Case");
const Doctor = require("../models/Doctor");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");  // Import your cloudinary config
const streamifier = require("streamifier");

// Helper function for Cloudinary upload
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "pedoderma/cases" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// Submit a new case (Parent)
exports.submitCase = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        imageUrls.push(url);
      }
    }

    const { doctorId, ...caseData } = req.body;
    if (!doctorId || !mongoose.isValidObjectId(doctorId)) {
      return res.status(400).json({ message: "Please select a doctor for this case." });
    }

    const doctor = await Doctor.findById(doctorId).select("_id");
    if (!doctor) {
      return res.status(400).json({ message: "The selected doctor is not available." });
    }

    const created = await Case.create({
      parentId: req.user._id,
      doctorId: doctor._id,
      imageUrls: imageUrls,
      ...caseData,
    });

    res.json(created);
  } catch (e) {
    console.error("SubmitCase ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all cases for a specific parent (Parent Dashboard)
exports.getMyCases = async (req, res) => {
  res.json(await Case.find({ parentId: req.user._id }));
};

// Get single case by ID (Parent & Doctor)
exports.getCaseById = async (req, res) => {
  const patientCase = await Case.findById(req.params.id);
  if (!patientCase) return res.status(404).json({ message: "Case not found" });

  const isOwner = req.user.role === "parent" && String(patientCase.parentId) === String(req.user._id);
  const isAssignedDoctor = req.user.role === "doctor" && String(patientCase.doctorId) === String(req.user._id);
  if (!isOwner && !isAssignedDoctor) {
    return res.status(403).json({ message: "You do not have access to this case." });
  }

  res.json(patientCase);
};

// Get all cases for doctors (Doctor Dashboard)
exports.getAllCases = async (req, res) => {
  res.json(await Case.find({ doctorId: req.user._id }));
};

// Review/update case (Doctor)
exports.reviewCase = async (req, res) => {
  try {
    const patientCase = await Case.findOne({ _id: req.params.id, doctorId: req.user._id });
    if (!patientCase) {
      return res.status(404).json({ message: "Case not found or not assigned to you." });
    }

    // A doctor can update clinical details, but can never reassign a case.
    const { doctorId, parentId, ...updateData } = req.body;

    const { appointmentDate, timeSlot } = req.body;
    if (appointmentDate && timeSlot) {
      const existing = await Case.findOne({
        doctorId: req.user._id,
        appointmentDate,
        timeSlot,
        _id: { $ne: req.params.id }
      });
      if (existing) {
        return res.status(400).json({ message: "This time slot is already booked for another patient." });
      }
    }

    const updated = await Case.findOneAndUpdate(
      { _id: req.params.id, doctorId: req.user._id },
      updateData,
      { new: true }
    );
    res.json(updated);
  } catch (e) {
    console.error("reviewCase ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};
