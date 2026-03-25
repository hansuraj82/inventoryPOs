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

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/low-stock', getLowStockProducts);
router.get('/barcode/:barcode', getProductByBarcode);
router.post('/', createProduct);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
