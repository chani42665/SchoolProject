const express = require("express");
const router = express.Router();
const { login } = require("../Controllers/AuthController");

// נתיב ל-Login
router.post("/login", login);

module.exports = router;