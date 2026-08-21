const jwt = require("jsonwebtoken");

const generateToken = (id, role, deviceId) => {
  return jwt.sign({ id, role, deviceId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

module.exports = generateToken;
