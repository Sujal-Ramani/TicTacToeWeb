const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

/**
 * POST /api/auth/register
 * body: { username, password }
 */
router.post("/register", register);

/**
 * POST /api/auth/login
 * body: { username, password }
 */
router.post("/login", login);

module.exports = router;
