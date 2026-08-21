const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otp: { type: String, required: true },
    ip: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // 5-minute TTL index
  }
);

module.exports = mongoose.model("Otp", otpSchema);
