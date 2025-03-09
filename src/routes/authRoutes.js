const express = require("express");
const { signupUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// POST localhost:5001/api/auth/signup
router.post("/signup", signupUser);

// POST localhost:5001/api/auth/login
router.post("/login", loginUser);

module.exports = router;