const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  next();
};

// Admin login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// Product creation validation
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters')
    .escape(),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters')
    .escape(),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  body('originalPrice')
    .isFloat({ min: 0.01 })
    .withMessage('Original price must be a positive number'),
  body('category')
    .isIn(['Chettinad Silks', 'Soft Sico', 'Ikath'])
    .withMessage('Category must be one of: Chettinad Silks, Soft Sico, Ikath'),
  body('stockQuantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  body('features.*')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Each feature must be between 5 and 100 characters')
    .escape(),
  body('colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array'),
  body('specifications.fabric')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Fabric specification must be between 3 and 100 characters')
    .escape(),
  body('specifications.length')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Length specification must be between 3 and 50 characters')
    .escape(),
  body('specifications.width')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Width specification must be between 3 and 50 characters')
    .escape(),
  body('specifications.weight')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Weight specification must be between 3 and 50 characters')
    .escape(),
  body('specifications.washCare')
    .optional()
    .isArray()
    .withMessage('Wash care must be an array'),
  handleValidationErrors
];

// Product update validation (partial)
const validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters')
    .escape(),
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  body('originalPrice')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Original price must be a positive number'),
  body('category')
    .optional()
    .isIn(['Chettinad Silks', 'Soft Sico', 'Ikath'])
    .withMessage('Category must be one of: Chettinad Silks, Soft Sico, Ikath'),
  body('stockQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  handleValidationErrors
];

// Stock update validation
const validateStockUpdate = [
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('operation')
    .isIn(['add', 'subtract', 'set'])
    .withMessage('Operation must be one of: add, subtract, set'),
  handleValidationErrors
];

// Product ID parameter validation
const validateProductId = [
  param('id')
    .matches(/^product:[0-9]+:[a-zA-Z0-9]+$/)
    .withMessage('Invalid product ID format'),
  handleValidationErrors
];

// Search query validation
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters')
    .escape(),
  query('category')
    .optional()
    .isIn(['Chettinad Silks', 'Soft Sico', 'Ikath', 'all'])
    .withMessage('Category must be one of: Chettinad Silks, Soft Sico, Ikath, all'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  handleValidationErrors
];

// File upload validation
const validateFileUpload = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one image file is required'
    });
  }

  // Check file types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  for (const file of req.files) {
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Only JPEG, PNG, and WebP images are allowed'
      });
    }
  }

  next();
};

// Sanitize input data
const sanitizeInput = (data) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? item.trim() : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

module.exports = {
  validateLogin,
  validateProduct,
  validateProductUpdate,
  validateStockUpdate,
  validateProductId,
  validateSearch,
  validateFileUpload,
  sanitizeInput,
  handleValidationErrors
};