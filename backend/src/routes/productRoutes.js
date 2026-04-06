const express = require('express');
const {
  getProducts,
  searchProducts,
  getProduct,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { createLimiter, searchLimiter } = require('../middleware/rateLimiter');
const { validate, validationSchemas } = require('../middleware/validators');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/', getProducts);
router.get('/search', searchLimiter, searchProducts);
router.get('/low-stock', getLowStockProducts);
router.get('/barcode/:barcode', getProductByBarcode);
router.post('/', createLimiter, validate(validationSchemas.createProduct), createProduct);
router.get('/:id', getProduct);
router.put('/:id', validate(validationSchemas.updateProduct), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
