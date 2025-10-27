// Existing imports
const express = require("express");
const router = express.Router();
const { signup, login, forgotPassword, resetPassword,redirectResetPassword } = require("../controllers/authController");

// Auth routes
router.post("/signup", signup);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/reset-password/:token", redirectResetPassword);

module.exports = router;
