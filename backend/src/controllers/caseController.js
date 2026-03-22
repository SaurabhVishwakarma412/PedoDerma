// backend/src/controllers/caseController.js
const Case = require("../models/Case");
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

    const created = await Case.create({
      parentId: req.user._id,
      imageUrls: imageUrls,
      ...req.body,
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
  res.json(await Case.findById(req.params.id));
};

// Get all cases for doctors (Doctor Dashboard)
exports.getAllCases = async (req, res) => {
  res.json(await Case.find());
};

// Review/update case (Doctor)
exports.reviewCase = async (req, res) => {
  const updated = await Case.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};