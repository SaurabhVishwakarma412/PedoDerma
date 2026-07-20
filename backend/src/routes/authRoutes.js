const router = require("express").Router();
const { registerParent, loginParent, loginAdmin, requestPasswordReset, resetPassword } = require("../controllers/authController");

router.post("/register", registerParent);
router.post("/login", loginParent);
router.post("/admin/login", loginAdmin);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
