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

router.post("/", auth, role(["parent"]), upload.single("image"), submitCase);
router.get("/my", auth, role(["parent"]), getMyCases);

router.get("/:id", auth, getCaseById);

router.get("/", auth, role(["doctor"]), getAllCases);
router.patch("/:id/review", auth, role(["doctor"]), reviewCase);

module.exports = router;
