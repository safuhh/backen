const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  currentuser,
} = require("../controller/authcontroller");
router.post("/register", register);
router.post("/login", login);
router.post("/currentuser", currentuser);
module.exports = router;
