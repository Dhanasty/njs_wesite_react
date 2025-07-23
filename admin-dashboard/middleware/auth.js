const jwt = require('jsonwebtoken');
const { RedisUtils } = require('../config/database');
const logger = require('../config/logger');

// JWT Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        logger.warn(`Invalid JWT token attempt: ${err.message}`);
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      // Check if admin still exists and is active
      const admin = await RedisUtils.getAdminByEmail(decoded.email);
      if (!admin || !admin.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Admin account not found or inactive'
        });
      }

      // Add admin info to request
      req.admin = {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: admin.role
      };

      logger.info(`Admin access: ${admin.email} - ${req.method} ${req.path}`);
      next();
    });
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Admin role verification middleware
const requireAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin privileges required'
    });
  }
  next();
};

// Session-based authentication (alternative)
const authenticateSession = async (req, res, next) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Please login to continue'
      });
    }

    const admin = await RedisUtils.getAdminByEmail(req.session.adminEmail);
    if (!admin || !admin.isActive) {
      req.session.destroy();
      return res.status(403).json({
        success: false,
        message: 'Admin account not found or inactive'
      });
    }

    req.admin = {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      role: admin.role
    };

    next();
  } catch (error) {
    logger.error('Session authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Rate limiting for specific routes
const createRateLimit = (windowMs, max, message) => {
  const rateLimit = require('express-rate-limit');
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Login rate limiting (stricter)
const loginRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many login attempts, please try again later'
);

// API rate limiting (general)
const apiRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many API requests, please try again later'
);

module.exports = {
  authenticateToken,
  requireAdmin,
  authenticateSession,
  loginRateLimit,
  apiRateLimit
};