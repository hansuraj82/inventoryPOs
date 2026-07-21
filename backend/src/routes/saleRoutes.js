const express = require('express');
const {
  getSales,
  getSale,
  searchSales,
  createSale,
  getTodaySales,
  getDashboardStats,
  getSalesAnalytics,
  updateSale
} = require('../controllers/saleController');
const { protect } = require('../middleware/auth');
const { createLimiter, searchLimiter } = require('../middleware/rateLimiter');
const { validate, validationSchemas } = require('../middleware/validators');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/search', searchLimiter, searchSales);
router.get('/analytics/graph', getSalesAnalytics);
router.get('/', getSales);
router.get('/stats/today', getTodaySales);
router.get('/stats/dashboard', getDashboardStats);
router.post('/', createLimiter, createSale);
router.get('/:id', getSale);
router.put('/:id', updateSale);

module.exports = router;
