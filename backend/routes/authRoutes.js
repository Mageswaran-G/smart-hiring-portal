// import express and create router
const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController');

// post /api/auth/signup
router.post('/signup', signup);

module.exports = router;