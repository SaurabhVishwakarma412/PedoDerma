const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "doctor" },
    specialization: { type: String, default: "Dermatology" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
