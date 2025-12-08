const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    description: String,
    duration: String,
    childAge: String,
    status: { type: String, default: "pending" },
    imageUrl: String,
    doctorNotes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Case", caseSchema);
