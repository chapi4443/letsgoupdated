const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  ResetPassword,
  forgotPassword
} = require("./authController.js");



router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", ResetPassword);

module.exports = router;
