const express = require('express');
const { RedisUtils } = require('../config/database');
const logger = require('../config/logger');
const { catchAsync } = require('../middleware/errorHandler');

const router = express.Router();

// Get all products for public consumption (no auth required)
router.get('/products', catchAsync(async (req, res) => {
  const { category, featured, limit = 50 } = req.query;

  let products;

  if (category && category !== 'all') {
    products = await RedisUtils.getProductsByCategory(category);
  } else {
    products = await RedisUtils.getAllProducts();
  }

  // Filter for featured products if requested
  if (featured === 'true') {
    products = products.filter(product => 
      product.badge === 'Featured' || product.badge === 'Bestseller'
    ).slice(0, 4);
  }

  // Apply limit
  if (limit) {
    products = products.slice(0, parseInt(limit));
  }

  // Remove sensitive admin fields
  const publicProducts = products.map(product => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    images: product.images || [],
    category: product.category,
    badge: product.badge,
    description: product.description,
    features: product.features || [],
    colors: product.colors || [],
    specifications: product.specifications || {},
    inStock: product.inStock
  }));

  logger.info(`Public API: Retrieved ${publicProducts.length} products`);

  res.json({
    success: true,
    data: publicProducts
  });
}));

// Get single product by slug for public consumption
router.get('/products/slug/:slug', catchAsync(async (req, res) => {
  const allProducts = await RedisUtils.getAllProducts();
  const product = allProducts.find(p => p.slug === req.params.slug);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Remove sensitive admin fields
  const publicProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    images: product.images || [],
    category: product.category,
    badge: product.badge,
    description: product.description,
    features: product.features || [],
    colors: product.colors || [],
    specifications: product.specifications || {},
    inStock: product.inStock
  };

  res.json({
    success: true,
    data: publicProduct
  });
}));

// Get products by category for public consumption
router.get('/products/category/:category', catchAsync(async (req, res) => {
  const category = decodeURIComponent(req.params.category);
  const products = await RedisUtils.getProductsByCategory(category);

  // Remove sensitive admin fields
  const publicProducts = products.map(product => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    images: product.images || [],
    category: product.category,
    badge: product.badge,
    description: product.description,
    features: product.features || [],
    colors: product.colors || [],
    specifications: product.specifications || {},
    inStock: product.inStock
  }));

  logger.info(`Public API: Retrieved ${publicProducts.length} products for category: ${category}`);

  res.json({
    success: true,
    data: publicProducts
  });
}));

// Get featured products for public consumption
router.get('/products/featured', catchAsync(async (req, res) => {
  const allProducts = await RedisUtils.getAllProducts();
  const featuredProducts = allProducts
    .filter(product => product.badge === 'Featured' || product.badge === 'Bestseller')
    .slice(0, 4);

  // Remove sensitive admin fields
  const publicProducts = featuredProducts.map(product => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    images: product.images || [],
    category: product.category,
    badge: product.badge,
    description: product.description,
    features: product.features || [],
    colors: product.colors || [],
    specifications: product.specifications || {},
    inStock: product.inStock
  }));

  logger.info(`Public API: Retrieved ${publicProducts.length} featured products`);

  res.json({
    success: true,
    data: publicProducts
  });
}));

// Get basic stats for public display (no sensitive info)
router.get('/stats', catchAsync(async (req, res) => {
  const allProducts = await RedisUtils.getAllProducts();
  const categories = {};
  
  allProducts.forEach(product => {
    categories[product.category] = (categories[product.category] || 0) + 1;
  });

  const stats = {
    totalProducts: allProducts.length,
    categories,
    lastUpdated: new Date().toISOString()
  };

  res.json({
    success: true,
    data: stats
  });
}));

module.exports = router;