const express = require("express");
const router = express.Router();
const login = require("../controllers/auth/login");
const signup = require("../controllers/auth/signup");

router.post("/login", login);
router.post("/signup", signup);

module.exports = router;
