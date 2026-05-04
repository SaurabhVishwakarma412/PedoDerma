const express = require("express");
const { sendContactEmail } = require("../controllers/contactController");

const router = express.Router();

// POST route for sending contact emails
router.post("/contact", sendContactEmail);

module.exports = router;