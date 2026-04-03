const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @route   GET /api/sales
// @desc    Get all sales for user
// @access  Private
exports.getSales = async (req, res, next) => {
  try {
    const sales = await Sale.find({ user: req.user.id })
      .populate('items.product', 'name barcode')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/sales/search
// @desc    Search sales
// @access  Private
exports.searchSales = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Please provide a search query' });
    }

    const regex = new RegExp(q, 'i');
    const sales = await Sale.find({
      user: req.user.id,
      $or: [
        { invoiceNumber: regex },
        { customerName: regex },
        { 'customer.mobile': regex }
      ]
    }).populate('items.product', 'name barcode').sort('-createdAt');

    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/sales/:id
// @desc    Get single sale
// @access  Private
exports.getSale = async (req, res, next) => {
  try {
    const sale = await Sale.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('items.product', 'name barcode price');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/sales
// @desc    Create a new sale
// @access  Private
exports.createSale = async (req, res, next) => {
  try {
    const { items, totalAmount, paymentMethod, paidAmount, notes, customer } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one item'
      });
    }

    if (!paymentMethod || !paidAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide payment method and paid amount'
      });
    }

    // Customer validation
    if (!customer || !customer.name || !customer.mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer name and mobile'
      });
    }

    // Get user shop name
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update product quantities
    let processedItems = [];
    let totalProfit = 0;

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.product,
        user: req.user.id
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      // Check if enough stock
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      // Update product quantity
      product.quantity -= item.quantity;
      await product.save();

      const itemCostPrice = product.costPrice || 0;
      const itemProfit = (item.price - itemCostPrice) * item.quantity;
      totalProfit += itemProfit;

      processedItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      });
    }

    // Create sale without invoice number first
    const creditAmount = Math.max(0, totalAmount - paidAmount);
    const change = Math.max(0, paidAmount - totalAmount);
    const isCredit = creditAmount > 0;

    const sale = await Sale.create({
      user: req.user.id,
      invoiceNumber: '', // Will update after getting _id
      customerName: customer.name,
      customer: {
        name: customer.name,
        mobile: customer.mobile,
        address: customer.address || '',
        email: customer.email || ''
      },
      items: processedItems,
      totalAmount,
      totalProfit,
      paymentMethod,
      paidAmount,
      change,
      isCredit,
      creditAmount,
      notes
    });

    // Generate Invoice Number using shop name and sale _id
    const invoiceNumber = `${user.shopName.replaceAll(' ', '').substring(0, 4).toUpperCase()}${sale._id.toString().substring(0, 4).toUpperCase()}`;
    
    // Update sale with invoice number
    sale.invoiceNumber = invoiceNumber;
    await sale.save();

    const populatedSale = await sale.populate('items.product', 'name barcode');

    res.status(201).json({
      success: true,
      data: populatedSale
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/sales/stats/today
// @desc    Get sales stats for today
// @access  Private
exports.getTodaySales = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      user: req.user.id,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalTransactions = sales.length;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalTransactions,
        sales
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/sales/stats/dashboard
// @desc    Get dashboard stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const products = await Product.find({ user: req.user.id });
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.quantity <= p.minStock).length;

    // Today's sales
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaySales = await Sale.find({
      user: req.user.id,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        lowStockProducts,
        todaySales: todaySales.length,
        todayRevenue,
        topProducts: products.slice(0, 5).sort((a, b) => b.quantity - a.quantity)
      }
    });
  } catch (error) {
    next(error);
  }
};
