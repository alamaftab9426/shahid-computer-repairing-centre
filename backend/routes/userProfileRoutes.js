const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadUserPhoto");
const { saveUserProfile, getUserProfile } = require("../controllers/userProfileController");
const verifyToken = require("../middleware/verifyToken");

router.post("/profile", verifyToken, upload.single("photo"), saveUserProfile);
router.get("/profile", verifyToken, getUserProfile);

module.exports = router;
