
const express = require('express');
const router = express.Router();

const {
  getQuotations,
  searchQuotations,
  getQuotation,
  createQuotation,
  updateQuotation,
  updateQuotationStatus,
  deleteQuotation,
} = require('../controllers/quotationController');
const { protect } = require('../middleware/auth');



// All quotation routes require authentication.
router.use(protect);

// Keep search before /:id.
router.get('/search', searchQuotations);
router.get('/', getQuotations);
router.post('/', createQuotation);
router.get('/:id', getQuotation);
router.put('/:id', updateQuotation);
router.patch('/:id/status', updateQuotationStatus);
router.delete('/:id', deleteQuotation);

module.exports = router;
