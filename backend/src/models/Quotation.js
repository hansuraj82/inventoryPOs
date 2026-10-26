
const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  quotationNumber: {
    type: String,
    required: true,
    unique: true
  },

  // Customer Information
  customerName: String,

  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    mobile: {
      type: String,
      required: true,
      trim: true
    },
    address: String,
    email: String
  },

  // Quoted Products
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      productName: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      hsnCode: String,
      gstRate: {
        type: Number,
        default: 18,
        min: 0
      },

      discount: {
        type: {
          type: String,
          enum: ['percentage', 'fixed'],
          default: 'percentage'
        },
        value: {
          type: Number,
          default: 0,
          min: 0
        },
        amount: {
          type: Number,
          default: 0,
          min: 0
        }
      },

      taxableValue: {
        type: Number,
        required: true,
        min: 0
      },
      taxAmount: {
        type: Number,
        required: true,
        min: 0
      },
      itemTotal: {
        type: Number,
        required: true,
        min: 0
      },
      subtotal: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],

  // Overall quotation discount
  saleDiscount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'fixed'
    },
    value: {
      type: Number,
      default: 0,
      min: 0
    },
    amount: {
      type: Number,
      default: 0,
      min: 0
    }
  },

  totalDiscountAmount: {
    type: Number,
    default: 0,
    min: 0
  },

  totalTaxableAmount: {
    type: Number,
    default: 0,
    min: 0
  },

  totalTaxAmount: {
    type: Number,
    default: 0,
    min: 0
  },

  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  isGstBill: {
    type: Boolean,
    default: true
  },

  businessDetails: {
    gstin: String,
    pan: String,
    address: String,
    phone: String,
    email: String,
    upiId: String
  },

  notes: String,

  // Quotation-specific fields
  status: {
    type: String,
    enum: ['draft', 'sent', 'accepted', 'rejected', 'expired', 'converted'],
    default: 'draft',
    index: true
  },

  validUntil: {
    type: Date,
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 15);
      return date;
    }
  },

  // Set when this quotation is converted into a real sale
  convertedSale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
    default: null
  },

  convertedAt: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically update updatedAt on document updates
quotationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Query indexes
quotationSchema.index({ user: 1, createdAt: -1 });
quotationSchema.index({ user: 1, status: 1 });
quotationSchema.index({ user: 1, validUntil: 1 });

module.exports = mongoose.model('Quotation', quotationSchema);
