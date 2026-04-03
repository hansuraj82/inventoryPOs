const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products for user
// @access  Private
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/search
// @desc    Search products by name or barcode
// @access  Private
exports.searchProducts = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const products = await Product.find({
      user: req.user.id,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { barcode: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Private
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/barcode/:barcode
// @desc    Get product by barcode
// @access  Private
exports.getProductByBarcode = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      user: req.user.id,
      barcode: req.params.barcode
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/products
// @desc    Create a product
// @access  Private
exports.createProduct = async (req, res, next) => {
  try {
    const { name, sellingPrice, costPrice, quantity, barcode, category, sku, description, minStock } = req.body;

    // Validation
    if (!name || !sellingPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and selling price'
      });
    }

    // Validate that costPrice <= sellingPrice
    if (costPrice && costPrice > sellingPrice) {
      return res.status(400).json({
        success: false,
        message: 'Cost price cannot be greater than selling price'
      });
    }

    // Check if barcode already exists
    if (barcode) {
      const existingProduct = await Product.findOne({ barcode });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Barcode already exists'
        });
      }
    }

    const product = await Product.create({
      user: req.user.id,
      name,
      price: sellingPrice,
      sellingPrice,
      costPrice: costPrice || 0,
      quantity: quantity || 0,
      barcode,
      category: category || 'General',
      sku,
      description,
      minStock: minStock || 5
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if new barcode already exists (only if barcode is being changed)
    if (req.body.barcode && req.body.barcode !== product.barcode) {
      const existingProduct = await Product.findOne({ barcode: req.body.barcode });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Barcode already exists'
        });
      }
    }

    // Validate that costPrice <= sellingPrice
    const sellingPrice = req.body.sellingPrice || product.sellingPrice;
    const costPrice = req.body.costPrice || product.costPrice;
    
    if (costPrice && costPrice > sellingPrice) {
      return res.status(400).json({
        success: false,
        message: 'Cost price cannot be greater than selling price'
      });
    }

    // Update fields - sync price with sellingPrice
    const updateData = { ...req.body, updatedAt: Date.now() };
    if (req.body.sellingPrice) {
      updateData.price = req.body.sellingPrice;
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/stats/low-stock
// @desc    Get low stock products
// @access  Private
exports.getLowStockProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      user: req.user.id,
      $expr: { $lte: ['$quantity', '$minStock'] }
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
