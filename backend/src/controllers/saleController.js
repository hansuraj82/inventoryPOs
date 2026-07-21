const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @route   GET /api/sales
// @desc    Get all sales for user with pagination
// @access  Private
exports.getSales = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 15));
    const skip = (page - 1) * limit;

    const [sales, totalCount] = await Promise.all([
      Sale.find({ user: req.user.id })
        .populate('items.product', 'name barcode')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Sale.countDocuments({ user: req.user.id })
    ]);

    res.status(200).json({
      success: true,
      count: sales.length,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: sales
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/sales/search
// @desc    Search sales with pagination
// @access  Private
exports.searchSales = async (req, res, next) => {
  try {
    let { q } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 15));
    const skip = (page - 1) * limit;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ success: false, message: 'Please provide a valid search query' });
    }

    // Trim and limit search query
    q = q.trim().substring(0, 100);

    if (q.length === 0) {
      return res.status(400).json({ success: false, message: 'Search query cannot be empty' });
    }

    // Escape special regex characters to prevent regex injection
    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Build query with proper regex pattern
    const searchPattern = new RegExp(escapedQuery, 'i');

    const searchFilter = {
      user: req.user.id,
      $or: [
        { invoiceNumber: searchPattern },
        { customerName: searchPattern },
        { 'customer.mobile': searchPattern }
      ]
    };

    const [sales, totalCount] = await Promise.all([
      Sale.find(searchFilter)
        .populate('items.product', 'name barcode')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Sale.countDocuments(searchFilter)
    ]);

    res.status(200).json({
      success: true,
      count: sales.length,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: sales
    });
  } catch (error) {
    // Handle MongoDB regex errors gracefully
    if (error.name === 'MongoError' || error.message.includes('regex')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid search query. Please try with simpler text.'
      });
    }
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
    const { items, totalAmount, paymentMethod, paidAmount, customer, isGstBill = true, saleDiscount, createdAt } = req.body;

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
    let totalTaxableAmount = 0;
    let totalTaxAmount = 0;
    let totalDiscountAmount = 0;

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

      // Calculate discount amount for this item
      const baseAmount = Number(item.price) * Number(item.quantity);
      let itemDiscountAmount = 0;
      let discountedAmount = baseAmount;

      if (item.discount && item.discount.value > 0) {
        if (item.discount.type === 'percentage') {
          itemDiscountAmount = Math.round(((baseAmount * item.discount.value) / 100) * 100) / 100;
          item.discount.amount = itemDiscountAmount;
        } else {
          itemDiscountAmount = Number(item.discount.value);
          item.discount.amount = itemDiscountAmount;
        }
        discountedAmount = baseAmount - itemDiscountAmount;
        totalDiscountAmount += itemDiscountAmount;
      }

      const itemProfit = (item.price - itemCostPrice) * item.quantity - itemDiscountAmount;
      totalProfit += itemProfit;

      // GST & HSN Calculations with explicit null/undefined/empty checks
      // Priority: Frontend value (item.gstRate/item.hsnCode) > Product DB value > Default
      let gstRate = 0;
      let hsnCode = '';

      if (isGstBill) {
        // IMPORTANT: Use strict checks to handle 0 as valid value
        // Get GST Rate
        let frontendGst = item.gstRate;
        // Check if frontend provided a value (including 0, but not undefined/null)
        if (frontendGst !== undefined && frontendGst !== null && frontendGst !== '') {
          gstRate = Number(frontendGst);
        } else if (product.gstRate !== undefined && product.gstRate !== null && product.gstRate !== '') {
          gstRate = Number(product.gstRate);
        } else {
          gstRate = 18;
        }

        // Get HSN Code
        let frontendHsn = item.hsnCode ? String(item.hsnCode).trim() : '';
        let productHsn = product.hsnCode ? String(product.hsnCode).trim() : '';

        if (frontendHsn !== '') {
          hsnCode = frontendHsn;
        } else if (productHsn !== '') {
          hsnCode = productHsn;
        } else {
          hsnCode = '';
        }
      }

      // Calculations - Tax applied on discounted amount
      const taxableValue = discountedAmount;
      const taxAmount = (taxableValue * gstRate) / 100;
      const itemTotal = taxableValue + taxAmount;

      totalTaxableAmount += taxableValue;
      totalTaxAmount += taxAmount;

      // Push to processedItems
      processedItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: item.price,
        hsnCode: hsnCode,
        gstRate: gstRate,
        discount: item.discount || { type: 'percentage', value: 0 },
        taxableValue: taxableValue,
        taxAmount: taxAmount,
        itemTotal: itemTotal,
        subtotal: itemTotal
      });
    }

    // Apply sale-level discount
    let saleLevelDiscountAmount = 0;
    let finalTotalAmount = totalTaxableAmount + totalTaxAmount;

    if (saleDiscount && saleDiscount.value > 0) {
      if (saleDiscount.type === 'percentage') {
        saleLevelDiscountAmount = Math.round(((finalTotalAmount * saleDiscount.value) / 100) * 100) / 100;
        saleDiscount.amount = saleLevelDiscountAmount;
      } else {
        saleLevelDiscountAmount = Number(saleDiscount.value);
        saleDiscount.amount = saleLevelDiscountAmount;
      }
      finalTotalAmount = Math.max(0, finalTotalAmount - saleLevelDiscountAmount);
      totalDiscountAmount += saleLevelDiscountAmount;
    }

    totalProfit -= saleLevelDiscountAmount;


    // Create sale without invoice number first
    // If payment is digital, they shouldn't get "change". Cap the paidAmount.
    const actualPaid = paymentMethod === 'cash'
      ? paidAmount
      : Math.min(paidAmount, finalTotalAmount);

    const creditAmount = Math.max(0, finalTotalAmount - actualPaid);
    const change = Math.max(0, actualPaid - finalTotalAmount);

    const isCredit = creditAmount > 0;

    const sale = await Sale.create({
      user: req.user.id,
      invoiceNumber: `${req.userId}-${Math.random()}`, // Will update after getting _id
      customerName: customer.name,
      customer: {
        name: customer.name,
        mobile: customer.mobile,
        address: customer.address || '',
        email: customer.email || ''
      },
      items: processedItems,
      totalAmount: finalTotalAmount,
      totalTaxableAmount,
      totalTaxAmount,
      totalDiscountAmount,
      saleDiscount: saleDiscount || { type: 'fixed', value: 0 },
      totalProfit,
      paymentMethod,
      paidAmount,
      change,
      isCredit,
      creditAmount,
      isGstBill: isGstBill !== undefined ? isGstBill : true,
      businessDetails: {
        gstin: user.businessDetails?.gstin || '',
        pan: user.businessDetails?.pan || '',
        address: user.businessDetails?.businessAddress || '',
        phone: user.businessDetails?.businessPhone || '',
        email: user.businessDetails?.businessEmail || ''
      },
      createdAt
    });

    // Generate Invoice Number using shop name and sale _id
    const invoiceNumber = `${user.shopName.replaceAll(' ', '').substring(0, 4).toUpperCase()}${sale._id.toString().substring(6, 10).toUpperCase()}`;

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


exports.updateSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { items, paymentMethod, paidAmount, customer, isGstBill = true, saleDiscount, createdAt } = req.body;

    // 1. Core Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one item'
      });
    }

    if (!paymentMethod || paidAmount === undefined || paidAmount === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide payment method and paid amount'
      });
    }

    if (!customer || !customer.name || !customer.mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer name and mobile'
      });
    }

    const User = require('../models/User');

    const existingSale = await Sale.findOne({ _id: id, user: req.user.id });
    if (!existingSale) {
      return res.status(404).json({
        success: false,
        message: 'Sale record not found'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // 3. STEP 1: Revert original product stock additions
    // Before subtracting new stock quantities, we must add back the old quantities.
    for (const oldItem of existingSale.items) {
      await Product.findOneAndUpdate(
        { _id: oldItem.product, user: req.user.id },
        { $inc: { quantity: oldItem.quantity } }
      );
    }

    // 4. STEP 2: Process new quantities & calculations
    let processedItems = [];
    let totalProfit = 0;
    let totalTaxableAmount = 0;
    let totalTaxAmount = 0;
    let totalDiscountAmount = 0;

    for (const item of items) {
      // Resolve product ID whether it is a nested object from frontend populate or a raw ID
      const productId = item.product?._id || item.product;
      const product = await Product.findOne({
        _id: productId,
        user: req.user.id
      });

      if (!product) {
        // Rollback: Re-deduct the original quantities to maintain DB state integrity
        for (const oldItem of existingSale.items) {
          await Product.findOneAndUpdate(
            { _id: oldItem.product, user: req.user.id },
            { $inc: { quantity: -oldItem.quantity } }
          );
        }
        return res.status(404).json({
          success: false,
          message: `Product not found during update execution: ${productId}`
        });
      }

      // Check if enough stock exists after previous reversion
      if (product.quantity < item.quantity) {
        // Rollback: Re-deduct original quantities
        for (const oldItem of existingSale.items) {
          await Product.findOneAndUpdate(
            { _id: oldItem.product, user: req.user.id },
            { $inc: { quantity: -oldItem.quantity } }
          );
        }
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}`
        });
      }

      // Deduct new updated stock level
      product.quantity -= item.quantity;
      await product.save();

      const itemCostPrice = product.costPrice || 0;

      // Item level discount calculations
      const baseAmount = Number(item.price) * Number(item.quantity);
      let itemDiscountAmount = 0;
      let discountedAmount = baseAmount;

      if (item.discount && item.discount.value >= 0) {
        if (item.discount.type === 'percentage') {
          itemDiscountAmount = Math.round(((baseAmount * item.discount.value) / 100) * 100) / 100;
          item.discount.amount = itemDiscountAmount;
        } else {
          itemDiscountAmount = Number(item.discount.value);
          item.discount.amount = itemDiscountAmount;
        }
        discountedAmount = baseAmount - itemDiscountAmount;
        totalDiscountAmount += itemDiscountAmount;
      }

      const itemProfit = (item.price - itemCostPrice) * item.quantity - itemDiscountAmount;
      totalProfit += itemProfit;

      // GST Rates & HSN Codes processing
      let gstRate = 0;
      let hsnCode = '';

      if (isGstBill) {
        let frontendGst = item.gstRate;
        if (frontendGst !== undefined && frontendGst !== null && frontendGst !== '') {
          gstRate = Number(frontendGst);
        } else if (product.gstRate !== undefined && product.gstRate !== null && product.gstRate !== '') {
          gstRate = Number(product.gstRate);
        } else {
          gstRate = 18;
        }

        let frontendHsn = item.hsnCode ? String(item.hsnCode).trim() : '';
        let productHsn = product.hsnCode ? String(product.hsnCode).trim() : '';

        if (frontendHsn !== '') {
          hsnCode = frontendHsn;
        } else if (productHsn !== '') {
          hsnCode = productHsn;
        } else {
          hsnCode = '';
        }
      }

      const taxableValue = discountedAmount;
      const taxAmount = (taxableValue * gstRate) / 100;
      const itemTotal = taxableValue + taxAmount;

      totalTaxableAmount += taxableValue;
      totalTaxAmount += taxAmount;

      processedItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: item.price,
        hsnCode: hsnCode,
        gstRate: gstRate,
        discount: item.discount || { type: 'percentage', value: 0 },
        taxableValue: taxableValue,
        taxAmount: taxAmount,
        itemTotal: itemTotal,
        subtotal: itemTotal
      });
    }

    // 5. Apply sale-level discount overrides
    let saleLevelDiscountAmount = 0;
    let finalTotalAmount = totalTaxableAmount + totalTaxAmount;

    if (saleDiscount && saleDiscount.value >= 0) {
      if (saleDiscount.type === 'percentage') {
        saleLevelDiscountAmount = Math.round(((finalTotalAmount * saleDiscount.value) / 100) * 100) / 100;
        saleDiscount.amount = saleLevelDiscountAmount;
      } else {
        saleLevelDiscountAmount = Number(saleDiscount.value);
        saleDiscount.amount = saleLevelDiscountAmount;
      }
      finalTotalAmount = Math.max(0, finalTotalAmount - saleLevelDiscountAmount);
      totalDiscountAmount += saleLevelDiscountAmount;
    }

    totalProfit -= saleLevelDiscountAmount;

    // 6. Payment limits, outstanding calculations & due credits
    const actualPaid = paymentMethod === 'cash'
      ? paidAmount
      : Math.min(paidAmount, finalTotalAmount);

    const creditAmount = Math.max(0, finalTotalAmount - actualPaid);
    const change = Math.max(0, actualPaid - finalTotalAmount);
    const isCredit = creditAmount > 0;

    // 7. Mutate existing document and persist updates
    existingSale.customerName = customer.name;
    existingSale.customer = {
      name: customer.name,
      mobile: customer.mobile,
      address: customer.address || '',
      email: customer.email || ''
    };
    existingSale.items = processedItems;
    existingSale.totalAmount = finalTotalAmount;
    existingSale.totalTaxableAmount = totalTaxableAmount;
    existingSale.totalTaxAmount = totalTaxAmount;
    existingSale.totalDiscountAmount = totalDiscountAmount;
    existingSale.saleDiscount = saleDiscount || { type: 'fixed', value: 0 };
    existingSale.totalProfit = totalProfit;
    existingSale.paymentMethod = paymentMethod;
    existingSale.paidAmount = paidAmount;
    existingSale.change = change;
    existingSale.isCredit = isCredit;
    existingSale.creditAmount = creditAmount;
    existingSale.isGstBill = isGstBill;
    existingSale.createdAt = createdAt;

    // Refresh business details dynamically just in case they've changed since creation
    existingSale.businessDetails = {
      gstin: user.businessDetails?.gstin || '',
      pan: user.businessDetails?.pan || '',
      address: user.businessDetails?.businessAddress || '',
      phone: user.businessDetails?.businessPhone || '',
      email: user.businessDetails?.businessEmail || ''
    };

    await existingSale.save();

    const populatedUpdatedSale = await existingSale.populate('items.product', 'name barcode');

    res.status(200).json({
      success: true,
      data: populatedUpdatedSale
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


    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.paidAmount, 0);
    const todayDue = todaySales.reduce((sum, sale) => sum + sale.creditAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        lowStockProducts,
        todaySales: todaySales.length,
        todayRevenue,
        todayDue,
        topProducts: products.slice(0, 5).sort((a, b) => b.quantity - a.quantity)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/sales/analytics/graph
// @desc    Get sales data for graph (by date range)
// @access  Private
exports.getSalesAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, period = 'daily' } = req.query;

    let start = new Date();
    let end = new Date();

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default to last 30 days
      start.setDate(start.getDate() - 30);
    }

    // Ensure start is at beginning of day and end is at end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      user: req.user.id,
      createdAt: {
        $gte: start,
        $lte: end
      }
    }).select('totalAmount createdAt items');

    // Group sales by date for graph
    const salesByDate = {};
    sales.forEach(sale => {
      const date = new Date(sale.createdAt);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format

      if (!salesByDate[dateKey]) {
        salesByDate[dateKey] = {
          date: dateKey,
          totalRevenue: 0,
          totalTransactions: 0,
          totalItems: 0
        };
      }

      salesByDate[dateKey].totalRevenue += sale.totalAmount;
      salesByDate[dateKey].totalTransactions += 1;
      salesByDate[dateKey].totalItems += sale.items.reduce((sum, item) => sum + item.quantity, 0);
    });

    // Convert to array and sort by date
    const graphData = Object.values(salesByDate).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate summary
    const summary = {
      totalRevenue: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
      totalTransactions: sales.length,
      totalItems: sales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0),
      averageTransactionValue: sales.length > 0 ? sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length : 0,
      dateRange: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      }
    };

    res.status(200).json({
      success: true,
      data: {
        graphData,
        summary,
        totalDays: graphData.length
      }
    });
  } catch (error) {
    next(error);
  }
};
