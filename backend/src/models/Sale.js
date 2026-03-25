const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Customer Information
  customer: {
    name: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    address: String,
    email: String
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      productName: String,
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      subtotal: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi'],
    required: true
  },
  paidAmount: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    default: 0
  },
  // Customer credit/debt tracking
  isCredit: {
    type: Boolean,
    default: false
  },
  creditAmount: {
    type: Number,
    default: 0
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
saleSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Sale', saleSchema);
