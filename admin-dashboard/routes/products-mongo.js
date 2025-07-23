const express = require('express');
const Product = require('../models/Product');
const logger = require('../config/logger');
const {
  validateProduct,
  validateProductUpdate,
  validateStockUpdate,
  validateProductId,
  validateSearch,
  sanitizeInput
} = require('../middleware/validation');
const { requireAdmin } = require('../middleware/auth-mongo');
const { catchAsync } = require('../middleware/errorHandler');

const router = express.Router();

// Get all products with optional filtering and pagination
router.get('/', validateSearch, catchAsync(async (req, res) => {
  const { q: searchQuery, category, limit = 50, offset = 0 } = req.query;

  let query = { isActive: true };
  let sort = { createdAt: -1 };

  // Search functionality
  if (searchQuery) {
    query.$or = [
      { name: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } },
      { category: { $regex: searchQuery, $options: 'i' } }
    ];
  }

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Get total count for pagination
  const total = await Product.countDocuments(query);

  // Get products with pagination
  const products = await Product.find(query)
    .sort(sort)
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .lean();

  // Calculate stock status for each product
  const productsWithStatus = products.map(product => ({
    ...product,
    stockStatus: product.stockQuantity <= 5 ? 'low' : 
                 product.stockQuantity <= 20 ? 'medium' : 'high'
  }));

  logger.info(`Retrieved ${products.length} products (total: ${total})`);

  res.json({
    success: true,
    data: {
      products: productsWithStatus,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    }
  });
}));

// Get single product by ID
router.get('/:id', validateProductId, catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();

  if (!product || !product.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Add stock status
  product.stockStatus = product.stockQuantity <= 5 ? 'low' : 
                       product.stockQuantity <= 20 ? 'medium' : 'high';

  res.json({
    success: true,
    data: { product }
  });
}));

// Create new product
router.post('/', requireAdmin, validateProduct, catchAsync(async (req, res) => {
  const sanitizedData = sanitizeInput(req.body);

  // Generate slug from name
  const slug = sanitizedData.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');

  // Check if slug already exists
  const existingProduct = await Product.findOne({ slug });
  if (existingProduct) {
    return res.status(400).json({
      success: false,
      message: 'A product with this name already exists'
    });
  }

  const productData = {
    ...sanitizedData,
    slug,
    inStock: sanitizedData.stockQuantity > 0,
    images: sanitizedData.images || [],
    colors: sanitizedData.colors || [],
    features: sanitizedData.features || [],
    specifications: {
      fabric: sanitizedData.specifications?.fabric || '',
      length: sanitizedData.specifications?.length || '',
      width: sanitizedData.specifications?.width || '',
      weight: sanitizedData.specifications?.weight || '',
      washCare: sanitizedData.specifications?.washCare || []
    }
  };

  const product = new Product(productData);
  await product.save();

  logger.info(`Product created: ${product.name} (ID: ${product._id}) by ${req.admin.email}`);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product }
  });
}));

// Update product
router.put('/:id', requireAdmin, validateProductId, validateProductUpdate, catchAsync(async (req, res) => {
  const sanitizedData = sanitizeInput(req.body);
  
  // Update slug if name changed
  if (sanitizedData.name) {
    sanitizedData.slug = sanitizedData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Check if new slug conflicts with existing product (excluding current product)
    const existingProduct = await Product.findOne({ 
      slug: sanitizedData.slug, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'A product with this name already exists'
      });
    }
  }

  // Update inStock status if stockQuantity changed
  if (sanitizedData.stockQuantity !== undefined) {
    sanitizedData.inStock = sanitizedData.stockQuantity > 0;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    sanitizedData,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  logger.info(`Product updated: ${updatedProduct.name} (ID: ${updatedProduct._id}) by ${req.admin.email}`);

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: { product: updatedProduct }
  });
}));

// Update stock quantity
router.patch('/:id/stock', requireAdmin, validateProductId, validateStockUpdate, catchAsync(async (req, res) => {
  const { quantity, operation } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  let newStock;
  switch (operation) {
    case 'add':
      newStock = product.stockQuantity + quantity;
      break;
    case 'subtract':
      newStock = Math.max(0, product.stockQuantity - quantity);
      break;
    case 'set':
      newStock = quantity;
      break;
    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid operation'
      });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      stockQuantity: newStock,
      inStock: newStock > 0
    },
    { new: true }
  );

  logger.info(`Stock updated for ${product.name}: ${product.stockQuantity} → ${newStock} (${operation}: ${quantity}) by ${req.admin.email}`);

  res.json({
    success: true,
    message: 'Stock updated successfully',
    data: {
      product: updatedProduct,
      stockChange: {
        operation,
        quantity,
        previousStock: product.stockQuantity,
        newStock
      }
    }
  });
}));

// Delete product (soft delete)
router.delete('/:id', requireAdmin, validateProductId, catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Soft delete by setting isActive to false
  product.isActive = false;
  await product.save();

  logger.info(`Product deleted: ${product.name} (ID: ${product._id}) by ${req.admin.email}`);

  res.json({
    success: true,
    message: 'Product deleted successfully',
    data: { deletedProduct: product }
  });
}));

// Get product statistics
router.get('/stats/overview', requireAdmin, catchAsync(async (req, res) => {
  const totalProducts = await Product.countDocuments({ isActive: true });
  
  const categoryStats = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  const lowStockCount = await Product.countDocuments({
    isActive: true,
    stockQuantity: { $lte: 10 }
  });

  const totalValue = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$stockQuantity'] } } } }
  ]);

  const categories = {};
  categoryStats.forEach(item => {
    categories[item._id] = item.count;
  });

  const stats = {
    totalProducts,
    categories,
    totalInventoryValue: totalValue[0]?.total || 0,
    lowStockProducts: lowStockCount,
    lastUpdated: new Date().toISOString()
  };

  res.json({
    success: true,
    data: { stats }
  });
}));

// Get low stock products
router.get('/alerts/low-stock', requireAdmin, catchAsync(async (req, res) => {
  const lowStockProducts = await Product.find({
    isActive: true,
    stockQuantity: { $lte: 10 }
  })
    .select('name category stockQuantity price updatedAt')
    .sort({ stockQuantity: 1 })
    .lean();

  res.json({
    success: true,
    data: {
      count: lowStockProducts.length,
      products: lowStockProducts
    }
  });
}));

// Bulk operations
router.post('/bulk/update-stock', requireAdmin, catchAsync(async (req, res) => {
  const { updates } = req.body; // Array of { productId, quantity, operation }

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Updates array is required'
    });
  }

  const results = [];
  const errors = [];

  for (const update of updates) {
    try {
      const { productId, quantity, operation } = update;
      const product = await Product.findById(productId);

      if (!product) {
        errors.push({ productId, error: 'Product not found' });
        continue;
      }

      let newStock;
      switch (operation) {
        case 'add':
          newStock = product.stockQuantity + quantity;
          break;
        case 'subtract':
          newStock = Math.max(0, product.stockQuantity - quantity);
          break;
        case 'set':
          newStock = quantity;
          break;
        default:
          errors.push({ productId, error: 'Invalid operation' });
          continue;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          stockQuantity: newStock,
          inStock: newStock > 0
        },
        { new: true }
      );

      results.push({
        productId,
        productName: product.name,
        previousStock: product.stockQuantity,
        newStock,
        operation,
        quantity
      });

    } catch (error) {
      errors.push({ productId: update.productId, error: error.message });
    }
  }

  logger.info(`Bulk stock update completed: ${results.length} success, ${errors.length} errors by ${req.admin.email}`);

  res.json({
    success: true,
    message: `Bulk update completed: ${results.length} updated, ${errors.length} errors`,
    data: {
      updated: results,
      errors
    }
  });
}));

module.exports = router;