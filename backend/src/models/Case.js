const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },

    title: { type: String, required: true },

    description: { type: String, required: true },

    duration: { type: String },

    childAge: { type: String },

    childName: { type: String }, // optional but good

    status: {
      type: String,
      enum: ["pending", "in_review", "completed"],
      default: "pending",
    },

    imageUrls: { type: [String], default: [] },

    doctorNotes: { type: String },

    additionalInfo: { type: String }, // parent extra notes

    severity: {
      type: String,
      enum: ["mild", "moderate", "severe", null],
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Case", caseSchema);

