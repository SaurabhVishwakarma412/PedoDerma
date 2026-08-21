const router = require("express").Router();
const { registerParent, loginParent, loginAdmin, requestPasswordReset, resetPassword, sendOtp } = require("../controllers/authController");

router.post("/register", registerParent);
router.post("/login", loginParent);
router.post("/admin/login", loginAdmin);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/send-otp", sendOtp);

module.exports = router;
