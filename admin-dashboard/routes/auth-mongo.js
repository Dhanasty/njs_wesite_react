const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const logger = require('../config/logger');
const { body, validationResult } = require('express-validator');
const { catchAsync } = require('../middleware/errorHandler');

const router = express.Router();

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input data',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Find admin by email
  const admin = await Admin.findOne({ email, isActive: true });
  
  if (!admin) {
    logger.warn(`Failed login attempt for email: ${email}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if account is locked
  if (admin.isLocked) {
    logger.warn(`Login attempt on locked account: ${email}`);
    return res.status(423).json({
      success: false,
      message: 'Account temporarily locked due to too many failed attempts'
    });
  }

  // Compare password
  const isValidPassword = await admin.comparePassword(password);
  
  if (!isValidPassword) {
    await admin.incLoginAttempts();
    logger.warn(`Failed login attempt for email: ${email}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Reset login attempts on successful login
  if (admin.loginAttempts > 0) {
    await admin.resetLoginAttempts();
  }

  // Update last login
  admin.lastLogin = new Date();
  await admin.save();

  // Create JWT token
  const token = jwt.sign(
    { 
      adminId: admin._id,
      email: admin.email,
      role: admin.role 
    },
    process.env.JWT_SECRET || 'default-jwt-secret',
    { expiresIn: '24h' }
  );

  // Store admin info in session
  req.session.adminId = admin._id.toString();
  req.session.adminEmail = admin.email;

  logger.info(`Admin logged in: ${admin.email}`);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      },
      token
    }
  });
}));

// Logout endpoint
router.post('/logout', catchAsync(async (req, res) => {
  const adminEmail = req.session.adminEmail;
  
  req.session.destroy((err) => {
    if (err) {
      logger.error('Session destruction error:', err);
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    
    logger.info(`Admin logged out: ${adminEmail}`);
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
}));

// Get current admin info
router.get('/me', catchAsync(async (req, res) => {
  if (!req.session.adminId) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  const admin = await Admin.findById(req.session.adminId).select('-password');
  
  if (!admin || !admin.isActive) {
    req.session.destroy();
    return res.status(401).json({
      success: false,
      message: 'Admin not found or inactive'
    });
  }

  res.json({
    success: true,
    data: {
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
      }
    }
  });
}));

// Change password endpoint
router.put('/change-password', [
  body('currentPassword').isLength({ min: 6 }),
  body('newPassword').isLength({ min: 6 })
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input data',
      errors: errors.array()
    });
  }

  if (!req.session.adminId) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.session.adminId);
  
  if (!admin) {
    return res.status(404).json({
      success: false,
      message: 'Admin not found'
    });
  }

  // Verify current password
  const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
  
  if (!isCurrentPasswordValid) {
    logger.warn(`Failed password change attempt for admin: ${admin.email}`);
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password (will be hashed by pre-save middleware)
  admin.password = newPassword;
  await admin.save();

  logger.info(`Password changed for admin: ${admin.email}`);

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

module.exports = router;