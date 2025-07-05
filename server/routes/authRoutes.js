const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { registerUSer,loginUser,forgotPassword , resetPassword , getCurrentUser,approveIntern } = require('../controllers/authController');

// Register new intern
router.post('/register', registerUSer);

// Approve intern
router.get('/approve-intern/:token', approveIntern);

// Login intern
router.post('/login',loginUser );

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

// Get current user (protected route)
router.get('/me', auth, getCurrentUser);

module.exports = router; 