const express = require('express');
const Product = require('../models/Product');
const logger = require('../config/logger');
const { catchAsync } = require('../middleware/errorHandler');

const router = express.Router();

// Get all products for public consumption (no auth required)
router.get('/products', catchAsync(async (req, res) => {
  const { category, featured, limit = 50 } = req.query;

  let query = { isActive: true };

  // Filter by category if provided
  if (category && category !== 'all') {
    query.category = category;
  }

  let products = Product.find(query);

  // Filter for featured products if requested
  if (featured === 'true') {
    query.badge = { $in: ['Featured', 'Bestseller'] };
    products = products.limit(4);
  } else if (limit) {
    products = products.limit(parseInt(limit));
  }

  const result = await products
    .select('-createdAt -updatedAt -__v -stockQuantity -isActive')
    .sort({ createdAt: -1 })
    .lean();

  logger.info(`Public API: Retrieved ${result.length} products`);

  res.json({
    success: true,
    data: result
  });
}));

// Get single product by slug for public consumption
router.get('/products/slug/:slug', catchAsync(async (req, res) => {
  const product = await Product.findOne({ 
    slug: req.params.slug, 
    isActive: true 
  })
    .select('-createdAt -updatedAt -__v -stockQuantity -isActive')
    .lean();

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({
    success: true,
    data: product
  });
}));

// Get products by category for public consumption
router.get('/products/category/:category', catchAsync(async (req, res) => {
  const category = decodeURIComponent(req.params.category);
  
  const products = await Product.find({ 
    category: category, 
    isActive: true 
  })
    .select('-createdAt -updatedAt -__v -stockQuantity -isActive')
    .sort({ createdAt: -1 })
    .lean();

  logger.info(`Public API: Retrieved ${products.length} products for category: ${category}`);

  res.json({
    success: true,
    data: products
  });
}));

// Get featured products for public consumption
router.get('/products/featured', catchAsync(async (req, res) => {
  const products = await Product.find({ 
    badge: { $in: ['Featured', 'Bestseller'] },
    isActive: true 
  })
    .select('-createdAt -updatedAt -__v -stockQuantity -isActive')
    .limit(4)
    .sort({ createdAt: -1 })
    .lean();

  logger.info(`Public API: Retrieved ${products.length} featured products`);

  res.json({
    success: true,
    data: products
  });
}));

// Get basic stats for public display (no sensitive info)
router.get('/stats', catchAsync(async (req, res) => {
  const totalProducts = await Product.countDocuments({ isActive: true });
  
  const categoryStats = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $project: { category: '$_id', count: 1, _id: 0 } }
  ]);

  const categories = {};
  categoryStats.forEach(item => {
    categories[item.category] = item.count;
  });

  const stats = {
    totalProducts,
    categories,
    lastUpdated: new Date().toISOString()
  };

  res.json({
    success: true,
    data: stats
  });
}));

// Search products
router.get('/products/search/:query', catchAsync(async (req, res) => {
  const searchQuery = req.params.query;
  
  const products = await Product.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { category: { $regex: searchQuery, $options: 'i' } }
        ]
      }
    ]
  })
    .select('-createdAt -updatedAt -__v -stockQuantity -isActive')
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  logger.info(`Public API: Found ${products.length} products for search: ${searchQuery}`);

  res.json({
    success: true,
    data: products
  });
}));

module.exports = router;