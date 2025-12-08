const bcrypt = require("bcryptjs");
const Doctor = require("../models/Doctor");
const generateToken = require("../utils/generateToken");

exports.loginDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ email: req.body.email });
    if (!doctor || !(await bcrypt.compare(req.body.password, doctor.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      token: generateToken(doctor._id, "doctor"),
      user: doctor,
    });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};
