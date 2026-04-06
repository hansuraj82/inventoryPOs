const Joi = require('joi');

// Validation schemas
const validationSchemas = {
  // Auth schemas
  register: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
  }),

  // Product schemas
  createProduct: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Product name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters'
    }),
    sellingPrice: Joi.number().positive().required().messages({
      'number.positive': 'Selling price must be greater than 0',
      'any.required': 'Selling price is required'
    }),
    costPrice: Joi.number().min(0).messages({
      'number.min': 'Cost price cannot be negative'
    }),
    quantity: Joi.number().min(0).messages({
      'number.min': 'Quantity cannot be negative'
    }),
    barcode: Joi.string().max(50).allow(null, '').messages({
      'string.max': 'Barcode cannot exceed 50 characters'
    }),
    category: Joi.string().max(50).messages({
      'string.max': 'Category cannot exceed 50 characters'
    }),
    sku: Joi.string().max(50).allow(null, '').messages({
      'string.max': 'SKU cannot exceed 50 characters'
    }),
    description: Joi.string().max(500).allow(null, '').messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
    minStock: Joi.number().min(0).messages({
      'number.min': 'Min stock cannot be negative'
    })
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(2).max(100).messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters'
    }),
    sellingPrice: Joi.number().positive().messages({
      'number.positive': 'Selling price must be greater than 0'
    }),
    costPrice: Joi.number().min(0).messages({
      'number.min': 'Cost price cannot be negative'
    }),
    quantity: Joi.number().min(0).messages({
      'number.min': 'Quantity cannot be negative'
    }),
    barcode: Joi.string().max(50).allow(null, '').messages({
      'string.max': 'Barcode cannot exceed 50 characters'
    }),
    category: Joi.string().max(50).messages({
      'string.max': 'Category cannot exceed 50 characters'
    }),
    sku: Joi.string().max(50).allow(null, '').messages({
      'string.max': 'SKU cannot exceed 50 characters'
    }),
    description: Joi.string().max(500).allow(null, '').messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
    minStock: Joi.number().min(0).messages({
      'number.min': 'Min stock cannot be negative'
    })
  }),

  // Sale schemas
  createSale: Joi.object({
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required(), // Changed from productId to match controller
      quantity: Joi.number().positive().required(),
      price: Joi.number().positive().required()
    })
  ).min(1).required(),
  paymentMethod: Joi.string().valid('cash', 'card', 'upi').required(),
  paidAmount: Joi.number().min(0).required(),
  totalAmount: Joi.number().positive().required(),
  notes: Joi.string().allow('', null),
  customer: Joi.object({
    name: Joi.string().required(),
    mobile: Joi.string().required(),
    address: Joi.string().allow(''),
    email: Joi.string().email().allow('')
  }).required()
})}

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const messages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    // Replace req.body with validated value
    req.body = value;
    next();
  };
};

module.exports = {
  validationSchemas,
  validate
};
