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

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/search', searchSales);
router.get('/', getSales);
router.get('/stats/today', getTodaySales);
router.get('/stats/dashboard', getDashboardStats);
router.post('/', createSale);
router.get('/:id', getSale);

module.exports = router;
