const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.registerParent = async (req, res) => {
  try {
    const { name, email, password, childName } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email exists" });

    const user = await User.create({
      name,
      email,
      childName,
      password: await bcrypt.hash(password, 10),
    });

    res.json({ message: "Registered Successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.loginParent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const parent = await User.findOne({ email });

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
