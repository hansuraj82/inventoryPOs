
const mongoose = require('mongoose');

const Quotation = require('../models/Quotation');
const Product = require('../models/Product');
const User = require('../models/User');

const VALID_STATUSES = [
  'draft',
  'sent',
  'accepted',
  'rejected',
  'expired',
];

// Escape special regex characters before searching.
const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Consistent API error helper.
const sendError = (res, status, message) =>
  res.status(status).json({
    success: false,
    message,
  });

// Normalize numeric input.
const toNumber = (value, fallback = 0) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
};

const roundMoney = (value) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

// Calculate quotation totals without modifying product stock.
async function buildQuotationData(body, userId) {
  const {
    items,
    customer,
    customerName,
    isGstBill = true,
    saleDiscount,
    notes = '',
    validUntil,
  } = body;

  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('Please provide at least one item');
    error.statusCode = 400;
    throw error;
  }

  const customerData = customer || {};

  const name = String(
    customerData.name || customerName || ''
  ).trim();

  const mobile = String(customerData.mobile || '').trim();

  if (!name || !mobile) {
    const error = new Error(
      'Please provide customer name and mobile'
    );
    error.statusCode = 400;
    throw error;
  }

  const gstBill = isGstBill !== false;

  let totalTaxableAmount = 0;
  let totalTaxAmount = 0;
  let totalDiscountAmount = 0;

  const processedItems = [];

  for (const item of items) {
    const productId =
      item.product?._id || item.product;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      const error = new Error('A valid product is required');
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.findOne({
      _id: productId,
      user: userId,
    });

    if (!product) {
      const error = new Error(
        `Product not found: ${productId}`
      );
      error.statusCode = 404;
      throw error;
    }

    const quantity = toNumber(item.quantity);
    const price = toNumber(item.price, product.price);

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      const error = new Error(
        `Invalid quantity or price for ${product.name}`
      );
      error.statusCode = 400;
      throw error;
    }

    const baseAmount = roundMoney(price * quantity);

    const discountType = item.discount?.type || 'percentage';
    const discountValue = toNumber(item.discount?.value);

    if (
      !['percentage', 'fixed'].includes(discountType) ||
      !Number.isFinite(discountValue) ||
      discountValue < 0 ||
      (discountType === 'percentage' && discountValue > 100)
    ) {
      const error = new Error(
        `Invalid discount for ${product.name}`
      );
      error.statusCode = 400;
      throw error;
    }

    let itemDiscountAmount =
      discountType === 'percentage'
        ? roundMoney((baseAmount * discountValue) / 100)
        : roundMoney(discountValue);

    // A discount cannot exceed the item's base amount.
    itemDiscountAmount = Math.min(
      baseAmount,
      itemDiscountAmount
    );

    const taxableValue = roundMoney(
      baseAmount - itemDiscountAmount
    );

    // Use frontend GST/HSN when provided, otherwise product values.
    let gstRate = 0;

    if (gstBill) {
      const suppliedGst =
        item.gstRate !== undefined &&
        item.gstRate !== null &&
        item.gstRate !== '';

      gstRate = suppliedGst
        ? toNumber(item.gstRate)
        : toNumber(product.gstRate, 18);

      if (
        !Number.isFinite(gstRate) ||
        gstRate < 0 ||
        gstRate > 100
      ) {
        const error = new Error(
          `Invalid GST rate for ${product.name}`
        );
        error.statusCode = 400;
        throw error;
      }
    }

    const suppliedHsn =
      item.hsnCode !== undefined &&
      item.hsnCode !== null &&
      String(item.hsnCode).trim() !== '';

    const hsnCode = gstBill
      ? suppliedHsn
        ? String(item.hsnCode).trim()
        : String(product.hsnCode || '').trim()
      : '';

    const taxAmount = roundMoney(
      (taxableValue * gstRate) / 100
    );

    const itemTotal = roundMoney(
      taxableValue + taxAmount
    );

    totalTaxableAmount += taxableValue;
    totalTaxAmount += taxAmount;
    totalDiscountAmount += itemDiscountAmount;

    processedItems.push({
      product: product._id,
      productName: product.name,
      quantity,
      price,
      hsnCode,
      gstRate,
      discount: {
        type: discountType,
        value: discountValue,
        amount: itemDiscountAmount,
      },
      taxableValue,
      taxAmount,
      itemTotal,
      subtotal: itemTotal,
    });
  }

  totalTaxableAmount = roundMoney(totalTaxableAmount);
  totalTaxAmount = roundMoney(totalTaxAmount);
  totalDiscountAmount = roundMoney(totalDiscountAmount);

  // Apply quotation-level discount after GST, matching the sale
  // calculation approach in your existing controller.
  const discountType = saleDiscount?.type || 'fixed';
  const discountValue = toNumber(saleDiscount?.value);

  if (
    !['percentage', 'fixed'].includes(discountType) ||
    !Number.isFinite(discountValue) ||
    discountValue < 0 ||
    (discountType === 'percentage' && discountValue > 100)
  ) {
    const error = new Error('Invalid quotation discount');
    error.statusCode = 400;
    throw error;
  }

  const beforeSaleDiscount = roundMoney(
    totalTaxableAmount + totalTaxAmount
  );

  let saleLevelDiscountAmount =
    discountType === 'percentage'
      ? roundMoney((beforeSaleDiscount * discountValue) / 100)
      : roundMoney(discountValue);

  saleLevelDiscountAmount = Math.min(
    beforeSaleDiscount,
    saleLevelDiscountAmount
  );

  totalDiscountAmount = roundMoney(
    totalDiscountAmount + saleLevelDiscountAmount
  );

  const totalAmount = roundMoney(
    Math.max(0, beforeSaleDiscount - saleLevelDiscountAmount)
  );

  let parsedValidUntil;

  if (validUntil) {
    parsedValidUntil = new Date(validUntil);

    if (Number.isNaN(parsedValidUntil.getTime())) {
      const error = new Error('Invalid quotation expiry date');
      error.statusCode = 400;
      throw error;
    }
  }

  return {
    customerName: name,
    customer: {
      name,
      mobile,
      address: String(customerData.address || '').trim(),
      email: String(customerData.email || '').trim(),
    },
    items: processedItems,
    saleDiscount: {
      type: discountType,
      value: discountValue,
      amount: saleLevelDiscountAmount,
    },
    totalDiscountAmount,
    totalTaxableAmount,
    totalTaxAmount,
    totalAmount,
    isGstBill: gstBill,
    notes: String(notes).trim(),
    ...(parsedValidUntil
      ? { validUntil: parsedValidUntil }
      : {}),
  };
}

// Generate a readable quotation number after the document has an ID.
function generateQuotationNumber(user, quotation) {
  const shopPrefix = String(user.shopName || 'SHOP')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 4)
    .toUpperCase() || 'SHOP';

  return `${shopPrefix}Q${quotation._id
    .toString()
    .slice(-6)
    .toUpperCase()}`;
}

// @route   GET /api/quotations
// @desc    Get quotations with pagination
// @access  Private
exports.getQuotations = async (req, res, next) => {
  try {
    const page = Math.max(
      1,
      parseInt(req.query.page, 10) || 1
    );

    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 15)
    );

    const skip = (page - 1) * limit;

    const filter = {
      user: req.user.id,
    };

    if (
      req.query.status &&
      VALID_STATUSES.includes(req.query.status)
    ) {
      filter.status = req.query.status;
    }

    const [quotations, totalCount] = await Promise.all([
      Quotation.find(filter)
        .populate('items.product', 'name barcode price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Quotation.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: quotations.length,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: quotations,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/quotations/search?q=...
// @desc    Search quotations with pagination
// @access  Private
exports.searchQuotations = async (req, res, next) => {
  try {
    let { q } = req.query;

    if (typeof q !== 'string' || !q.trim()) {
      return sendError(
        res,
        400,
        'Please provide a valid search query'
      );
    }

    q = q.trim().substring(0, 100);

    const page = Math.max(
      1,
      parseInt(req.query.page, 10) || 1
    );

    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 15)
    );

    const skip = (page - 1) * limit;
    const searchPattern = new RegExp(escapeRegex(q), 'i');

    const filter = {
      user: req.user.id,
      $or: [
        { quotationNumber: searchPattern },
        { customerName: searchPattern },
        { 'customer.name': searchPattern },
        { 'customer.mobile': searchPattern },
      ],
    };

    const [quotations, totalCount] = await Promise.all([
      Quotation.find(filter)
        .populate('items.product', 'name barcode price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Quotation.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: quotations.length,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: quotations,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/quotations/:id
// @desc    Get one quotation
// @access  Private
exports.getQuotation = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid quotation ID');
    }

    const quotation = await Quotation.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('items.product', 'name barcode price');

    if (!quotation) {
      return sendError(res, 404, 'Quotation not found');
    }

    return res.status(200).json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/quotations
// @desc    Create a quotation without creating a sale
// @access  Private
exports.createQuotation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    const quotationData = await buildQuotationData(
      req.body,
      req.user.id
    );

    // Temporary unique number prevents collisions before the ID exists.
    const quotation = await Quotation.create({
      user: req.user.id,
      quotationNumber:
        `TEMP-${req.user.id}-${new mongoose.Types.ObjectId()}`,
      ...quotationData,
      businessDetails: {
        gstin: user.businessDetails?.gstin || '',
        pan: user.businessDetails?.pan || '',
        address: user.businessDetails?.businessAddress || '',
        phone: user.businessDetails?.businessPhone || '',
        email: user.businessDetails?.businessEmail || '',
        upiId: user.businessDetails?.upiId || '',
      },
      status: 'draft',
    });

    quotation.quotationNumber = generateQuotationNumber(
      user,
      quotation
    );

    await quotation.save();

    const populatedQuotation = await quotation.populate(
      'items.product',
      'name barcode price'
    );

    return res.status(201).json({
      success: true,
      message: 'Quotation created successfully',
      data: populatedQuotation,
    });
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }

    next(error);
  }
};

// @route   PUT /api/quotations/:id
// @desc    Update a quotation without modifying stock
// @access  Private
exports.updateQuotation = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid quotation ID');
    }

    const quotation = await Quotation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!quotation) {
      return sendError(res, 404, 'Quotation not found');
    }

    if (quotation.convertedSale) {
      return sendError(
        res,
        400,
        'A converted quotation cannot be edited'
      );
    }

    if (
      req.body.status &&
      !VALID_STATUSES.includes(req.body.status)
    ) {
      return sendError(res, 400, 'Invalid quotation status');
    }

    const quotationData = await buildQuotationData(
      {
        ...req.body,
        customer: req.body.customer || quotation.customer,
        customerName:
          req.body.customerName || quotation.customerName,
        items: req.body.items ?? quotation.items,
        isGstBill:
          req.body.isGstBill ?? quotation.isGstBill,
        saleDiscount:
          req.body.saleDiscount ?? quotation.saleDiscount,
        notes: req.body.notes ?? quotation.notes,
        validUntil:
          req.body.validUntil ?? quotation.validUntil,
      },
      req.user.id
    );

    // Keep identity, number, and conversion fields under server control.
    Object.assign(quotation, quotationData);

    if (req.body.status) {
      quotation.status = req.body.status;
    }

    await quotation.save();

    const populatedQuotation = await quotation.populate(
      'items.product',
      'name barcode price'
    );

    return res.status(200).json({
      success: true,
      message: 'Quotation updated successfully',
      data: populatedQuotation,
    });
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }

    next(error);
  }
};

// @route   PATCH /api/quotations/:id/status
// @desc    Update quotation status
// @access  Private
exports.updateQuotationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid quotation ID');
    }

    if (!VALID_STATUSES.includes(status)) {
      return sendError(res, 400, 'Invalid quotation status');
    }

    const quotation = await Quotation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!quotation) {
      return sendError(res, 404, 'Quotation not found');
    }

    if (quotation.convertedSale) {
      return sendError(
        res,
        400,
        'This quotation has already been converted to a sale'
      );
    }

    quotation.status = status;
    await quotation.save();

    return res.status(200).json({
      success: true,
      message: 'Quotation status updated successfully',
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/quotations/:id
// @desc    Delete a quotation
// @access  Private
exports.deleteQuotation = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid quotation ID');
    }

    const quotation = await Quotation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!quotation) {
      return sendError(res, 404, 'Quotation not found');
    }

    if (quotation.convertedSale) {
      return sendError(
        res,
        400,
        'A converted quotation cannot be deleted'
      );
    }

    await quotation.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Quotation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
