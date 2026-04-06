const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate, validationSchemas } = require('../middleware/validators');

const router = express.Router();

router.post('/register', authLimiter, validate(validationSchemas.register), register);
router.post('/login', authLimiter, validate(validationSchemas.login), login);
router.get('/me', protect, getCurrentUser);

module.exports = router;
