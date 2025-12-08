const Case = require("../models/Case");

exports.submitCase = async (req, res) => {
  try {
    const filePath = req.file ? `/${process.env.UPLOAD_PATH}/${req.file.filename}` : "";

    const created = await Case.create({
      parentId: req.user._id,
      imageUrl: filePath,
      ...req.body,
    });

    res.json(created);
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMyCases = async (req, res) => {
  res.json(await Case.find({ parentId: req.user._id }));
};

exports.getCaseById = async (req, res) => {
  res.json(await Case.findById(req.params.id));
};

exports.getAllCases = async (req, res) => {
  res.json(await Case.find());
};

exports.reviewCase = async (req, res) => {
  const updated = await Case.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};
