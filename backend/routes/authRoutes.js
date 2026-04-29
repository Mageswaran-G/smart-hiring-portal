// import express and create router
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// post /api/auth/signup
router.post('/signup', signup);

// post /api/auth/login
router.post('/login', login);

module.exports = router;