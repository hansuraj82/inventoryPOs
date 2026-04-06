const express = require('express');
const {
  getSales,
  getSale,
  searchSales,
  createSale,
  getTodaySales,
  getDashboardStats
} = require('../controllers/saleController');
const { protect } = require('../middleware/auth');
const { createLimiter, searchLimiter } = require('../middleware/rateLimiter');
const { validate, validationSchemas } = require('../middleware/validators');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/search', searchLimiter, searchSales);
router.get('/', getSales);
router.get('/stats/today', getTodaySales);
router.get('/stats/dashboard', getDashboardStats);
router.post('/', createLimiter, validate(validationSchemas.createSale), createSale);
router.get('/:id', getSale);

module.exports = router;
