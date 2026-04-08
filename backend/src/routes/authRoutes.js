const express = require('express');
const { register, login, getCurrentUser, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate, validationSchemas } = require('../middleware/validators');

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, validate(validationSchemas.login), login);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, validate(validationSchemas.updateProfile), updateProfile);
router.post('/change-password', protect, authLimiter, validate(validationSchemas.changePassword), changePassword);

module.exports = router;
