const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const Doctor = require("../models/Doctor");

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

    // No email provider is configured in this project yet. Return the token so
    // the UI can complete the flow; production should email this value instead.
    res.json({ message: "Reset token generated. It expires in 15 minutes.", resetToken: token });
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
    const { name, email, password, childName } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email exists" });

    const user = await User.create({
      name,
      email,
      childName: childName || null,
      password: await bcrypt.hash(password, 10),
    });

    res.json({ message: "Registered Successfully" });
  } catch (e) {
    console.error(e); // Log the error for debugging
    res.status(500).json({ message: "Server Error" });
  }
};

exports.loginParent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const parent = await User.findOne({ email, role: "parent" });

    if (!parent || !(await bcrypt.compare(password, parent.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      token: generateToken(parent._id, "parent"),
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

    res.json({
      token: generateToken(admin._id, "admin"),
      user: { _id: admin._id, name: admin.name, email: admin.email, role: "admin" },
    });
  } catch (e) {
    console.error("LoginAdmin ERROR:", e);
    res.status(500).json({ message: "Server Error" });
  }
};
