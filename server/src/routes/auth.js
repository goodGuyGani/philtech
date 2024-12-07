const express = require("express");
const { login } = require("../controllers/auth-controller");

const router = express.Router();

// POST login route
router.post("/auth/login", login);

module.exports = router;
