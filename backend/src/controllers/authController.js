const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const Doctor = require("../models/Doctor");
const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");

const findAccount = async (email, role) => {
  if (role === "doctor") return Doctor.findOne({ email: email.toLowerCase(), role: "doctor" }).select("+resetPasswordToken +resetPasswordExpires");
  return User.findOne({ email: email.toLowerCase(), role }).select("+resetPasswordToken +resetPasswordExpires");
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !["parent", "doctor", "admin"].includes(role)) {
      return res.status(400).json({ message: "Email and a valid role are required" });
    }
    const account = await findAccount(email.trim(), role);
    if (!account) return res.status(404).json({ message: "No account found for that email and role" });

    const token = crypto.randomBytes(32).toString("hex");
    account.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    account.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await account.save();

    // Send reset token via email
    await sendEmail({
      to: account.email,
      subject: "Dermaslot Password Reset Request",
      text: `You requested a password reset. Your reset token is:\n\n${token}\n\nIt expires in 15 minutes. If you did not request this, please ignore this email.`,
      html: `<h2>Dermaslot Password Reset</h2><p>You requested a password reset. Your reset token is:</p><h3 style="background:#f4f4f4;padding:10px;display:inline-block;letter-spacing:1px;">${token}</h3><p>It expires in 15 minutes. If you did not request this, please ignore this email.</p>`
    });

    res.json({ message: "Reset token generated and sent to your email. It expires in 15 minutes." });
  } catch (e) {
    console.error("RequestPasswordReset ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, role } = req.body;
    if (!token || !password || password.length < 6 || !["parent", "doctor", "admin"].includes(role)) {
      return res.status(400).json({ message: "Token, role and a password of at least 6 characters are required" });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const Model = role === "doctor" ? Doctor : User;
    const account = await Model.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: new Date() }, role }).select("+resetPasswordToken +resetPasswordExpires");
    if (!account) return res.status(400).json({ message: "Reset token is invalid or expired" });

    account.password = await bcrypt.hash(password, 10);
    account.resetPasswordToken = undefined;
    account.resetPasswordExpires = undefined;
    await account.save();
    res.json({ message: "Password updated successfully. You can now log in." });
  } catch (e) {
    console.error("ResetPassword ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.registerParent = async (req, res) => {
  try {
    const { name, email, password, childName, otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email exists" });

    // Verify OTP
    const validOtp = await Otp.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });
    if (!validOtp || validOtp.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Delete the verified OTP
    await Otp.deleteMany({ email: email.toLowerCase() });

    const user = await User.create({
      name,
      email,
      childName: childName || null,
      password: await bcrypt.hash(password, 10),
    });

    res.json({ message: "Registered Successfully" });
  } catch (e) {
    console.error("RegisterParent ERROR:", e); // Log the error for debugging
    res.status(500).json({ message: "Server Error" });
  }
};

exports.loginParent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const parent = await User.findOne({ email, role: "parent" });

    if (!parent || !(await bcrypt.compare(password, parent.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    const deviceId = req.headers["x-device-id"] || "";
    res.json({
      token: generateToken(parent._id, "parent", deviceId),
      user: parent,
    });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Admin accounts are provisioned privately (for example with seedAdmin.js),
// but use the same User collection and JWT middleware as parent accounts.
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    const deviceId = req.headers["x-device-id"] || "";
    res.json({
      token: generateToken(admin._id, "admin", deviceId),
      user: { _id: admin._id, name: admin.name, email: admin.email, role: "admin" },
    });
  } catch (e) {
    console.error("LoginAdmin ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "A valid email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if the email exists already
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // Rate Limit 1: Max one request per 60 seconds per email
    const recentOtp = await Otp.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });
    if (recentOtp && (Date.now() - recentOtp.createdAt.getTime() < 60000)) {
      return res.status(429).json({ message: "Please wait 60 seconds before requesting another OTP." });
    }

    // Rate Limit 2: Max 5 OTP requests per email per hour
    const oneHourAgo = new Date(Date.now() - 3600000);
    const emailOtpCount = await Otp.countDocuments({ email: normalizedEmail, createdAt: { $gte: oneHourAgo } });
    if (emailOtpCount >= 5) {
      return res.status(429).json({ message: "Too many OTP requests. Please try again after an hour." });
    }

    // Rate Limit 3: Max 10 OTP requests per IP per hour
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ipOtpCount = await Otp.countDocuments({ ip, createdAt: { $gte: oneHourAgo } });
    if (ipOtpCount >= 10) {
      return res.status(429).json({ message: "Too many OTP requests from this device. Please try again later." });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save Otp
    await Otp.create({
      email: normalizedEmail,
      otp,
      ip
    });

    // Send Otp
    await sendEmail({
      to: normalizedEmail,
      subject: "Dermaslot Email Verification OTP",
      text: `Your OTP code for registration is: ${otp}. It will expire in 5 minutes.`,
      html: `<h2>Dermaslot Email Verification</h2><p>Your OTP code for registration is: <strong>${otp}</strong>.</p><p>This code will expire in 5 minutes.</p>`
    });

    res.json({ message: "OTP sent successfully." });
  } catch (e) {
    console.error("SendOtp ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};
