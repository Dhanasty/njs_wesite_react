const express = require('express');
const { RedisUtils } = require('../config/database');
const logger = require('../config/logger');
const {
  validateProduct,
  validateProductUpdate,
  validateStockUpdate,
  validateProductId,
  validateSearch,
  sanitizeInput
} = require('../middleware/validation');
const { requireAdmin } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');

const router = express.Router();

// Get all products with optional filtering and pagination
router.get('/', validateSearch, catchAsync(async (req, res) => {
  const { q: searchQuery, category, limit = 50, offset = 0 } = req.query;

  let products;

  if (searchQuery) {
    products = await RedisUtils.searchProducts(searchQuery);
  } else if (category && category !== 'all') {
    products = await RedisUtils.getProductsByCategory(category);
  } else {
    products = await RedisUtils.getAllProducts();
  }

  // Apply pagination
  const startIndex = parseInt(offset);
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Calculate stock status for each product
  const productsWithStatus = paginatedProducts.map(product => ({
    ...product,
    stockStatus: product.stockQuantity <= 5 ? 'low' : 
                 product.stockQuantity <= 20 ? 'medium' : 'high'
  }));

  logger.info(`Retrieved ${paginatedProducts.length} products (total: ${products.length})`);

  res.json({
    success: true,
    data: {
      products: productsWithStatus,
      pagination: {
        total: products.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: endIndex < products.length
      }
    }
  });
}));

// Get single product by ID
router.get('/:id', validateProductId, catchAsync(async (req, res) => {
  const product = await RedisUtils.getProduct(req.params.id);

  if (!product) {
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

  const product = await RedisUtils.createProduct(productData);

  logger.info(`Product created: ${product.name} (ID: ${product.id}) by ${req.admin.email}`);

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
  }

  // Update inStock status if stockQuantity changed
  if (sanitizedData.stockQuantity !== undefined) {
    sanitizedData.inStock = sanitizedData.stockQuantity > 0;
  }

  const updatedProduct = await RedisUtils.updateProduct(req.params.id, sanitizedData);

  if (!updatedProduct) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  logger.info(`Product updated: ${updatedProduct.name} (ID: ${updatedProduct.id}) by ${req.admin.email}`);

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: { product: updatedProduct }
  });
}));

// Update stock quantity
router.patch('/:id/stock', requireAdmin, validateProductId, validateStockUpdate, catchAsync(async (req, res) => {
  const { quantity, operation } = req.body;
  const product = await RedisUtils.getProduct(req.params.id);

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

  const updatedProduct = await RedisUtils.updateProduct(req.params.id, {
    stockQuantity: newStock,
    inStock: newStock > 0
  });

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

// Delete product
router.delete('/:id', requireAdmin, validateProductId, catchAsync(async (req, res) => {
  const product = await RedisUtils.getProduct(req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const deleted = await RedisUtils.deleteProduct(req.params.id);

  if (!deleted) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }

  logger.info(`Product deleted: ${product.name} (ID: ${product.id}) by ${req.admin.email}`);

  res.json({
    success: true,
    message: 'Product deleted successfully',
    data: { deletedProduct: product }
  });
}));

// Get product statistics
router.get('/stats/overview', requireAdmin, catchAsync(async (req, res) => {
  const stats = await RedisUtils.getProductStats();

  res.json({
    success: true,
    data: { stats }
  });
}));

// Get low stock products
router.get('/alerts/low-stock', requireAdmin, catchAsync(async (req, res) => {
  const allProducts = await RedisUtils.getAllProducts();
  const lowStockProducts = allProducts
    .filter(product => product.stockQuantity <= 10)
    .sort((a, b) => a.stockQuantity - b.stockQuantity);

  res.json({
    success: true,
    data: {
      count: lowStockProducts.length,
      products: lowStockProducts.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        stockQuantity: product.stockQuantity,
        price: product.price,
        lastUpdated: product.updatedAt
      }))
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
      const product = await RedisUtils.getProduct(productId);

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

      const updatedProduct = await RedisUtils.updateProduct(productId, {
        stockQuantity: newStock,
        inStock: newStock > 0
      });

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