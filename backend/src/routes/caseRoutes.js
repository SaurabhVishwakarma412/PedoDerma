// backend/routes/caseRoutes.js
const router = require("express").Router();
const upload = require("../config/multer");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  submitCase,
  getMyCases,
  getCaseById,
  getAllCases,
  reviewCase,
} = require("../controllers/caseController");

// Parent
router.post("/", auth, role(["parent"]), upload.array("images", 5), submitCase);
router.get("/my", auth, role(["parent"]), getMyCases);

// Doctor
router.get("/all", auth, role(["doctor"]), getAllCases);
router.patch("/:id/review", auth, role(["doctor"]), reviewCase);

// Common
router.get("/:id", auth, getCaseById);

module.exports = router;
