const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a product name']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    default: 0
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    default: 'General'
  },
  sku: {
    type: String
  },
  description: {
    type: String
  },
  minStock: {
    type: Number,
    default: 5
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

// Index for faster search
productSchema.index({ user: 1, name: 'text', barcode: 1 });

module.exports = mongoose.model('Product', productSchema);
