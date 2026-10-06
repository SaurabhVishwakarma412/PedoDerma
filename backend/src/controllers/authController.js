const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const Doctor = require("../models/Doctor");
const sendEmail = require("../utils/sendEmail");

const findAccount = async (email, role) => {
  if (role === "doctor") {
    return Doctor.findOne({ email: email.toLowerCase(), role: "doctor" }).select("+resetPasswordToken +resetPasswordExpires");
  }

  return User.findOne({ email: email.toLowerCase(), role }).select("+resetPasswordToken +resetPasswordExpires");
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !["parent", "doctor", "admin"].includes(role)) {
      return res.status(400).json({ message: "Email and a valid role are required" });
    }

    const account = await findAccount(email.trim(), role);
    if (!account) {
      return res.status(404).json({ message: "No account found for that email and role" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    account.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    account.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await account.save();

    await sendEmail({
      to: account.email,
      subject: "Dermaslot Password Reset Request",
      text: `You requested a password reset. Your reset token is:\n\n${token}\n\nIt expires in 15 minutes. If you did not request this, please ignore this email.`,
      html: `<h2>Dermaslot Password Reset</h2><p>You requested a password reset. Your reset token is:</p><h3 style="background:#f4f4f4;padding:10px;display:inline-block;letter-spacing:1px;">${token}</h3><p>It expires in 15 minutes. If you did not request this, please ignore this email.</p>`,
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
    const account = await Model.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
      role,
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!account) {
      return res.status(400).json({ message: "Reset token is invalid or expired" });
    }

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
    const {
      name,
      email,
      password,
      childName,
      phone,
      address,
      city,
      state,
      zipCode,
      subscribeToUpdates,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: "A valid email is required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(400).json({ message: "Email exists" });
    }

    await User.create({
      name: name.trim(),
      email: normalizedEmail,
      childName: childName || null,
      phone: phone || "",
      address: address || "",
      city: city || "",
      state: state || "",
      zipCode: zipCode || "",
      subscribeToUpdates: subscribeToUpdates !== false,
      password: await bcrypt.hash(password, 10),
    });

    res.json({ message: "Registered Successfully" });
  } catch (e) {
    console.error("RegisterParent ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.loginParent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const parent = await User.findOne({ email: email.trim().toLowerCase(), role: "parent" });

    if (!parent || !(await bcrypt.compare(password, parent.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const deviceId = req.headers["x-device-id"] || "";
    res.json({
      token: generateToken(parent._id, "parent", deviceId),
      user: parent,
    });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email: email.trim().toLowerCase(), role: "admin" });

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
