
const Case = require("../models/Case");

// Submit a new case (Parent)
exports.submitCase = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    // Handle multiple files
    const imagePaths = req.files ? req.files.map(f => `/uploads/cases/${f.filename}`) : [];

    const created = await Case.create({
      parentId: req.user._id,
      imageUrls: imagePaths,
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