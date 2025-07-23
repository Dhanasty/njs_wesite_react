const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { RedisUtils } = require('../config/database');
const logger = require('../config/logger');
const { validateLogin } = require('../middleware/validation');
const { loginRateLimit, authenticateToken } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');

const router = express.Router();

// Login endpoint
router.post('/login', loginRateLimit, validateLogin, catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find admin user
  const admin = await RedisUtils.getAdminByEmail(email);
  if (!admin) {
    logger.warn(`Failed login attempt for email: ${email}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if admin is active
  if (!admin.isActive) {
    logger.warn(`Inactive admin login attempt: ${email}`);
    return res.status(401).json({
      success: false,
      message: 'Account is inactive. Please contact support.'
    });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    logger.warn(`Invalid password for admin: ${email}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Update last login
  await RedisUtils.updateAdminLastLogin(email);

  // Generate JWT token
  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );

  // Set session
  req.session.adminId = admin.id;
  req.session.adminEmail = admin.email;

  logger.info(`Successful login: ${email}`);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    }
  });
}));

// Logout endpoint
router.post('/logout', authenticateToken, catchAsync(async (req, res) => {
  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      logger.error('Session destruction error:', err);
    }
  });

  logger.info(`Admin logged out: ${req.admin.email}`);

  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

// Get current admin profile
router.get('/profile', authenticateToken, catchAsync(async (req, res) => {
  const admin = await RedisUtils.getAdminByEmail(req.admin.email);
  
  if (!admin) {
    return res.status(404).json({
      success: false,
      message: 'Admin profile not found'
    });
  }

  res.json({
    success: true,
    data: {
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
        lastLogin: admin.lastLogin
      }
    }
  });
}));

// Verify token endpoint
router.get('/verify', authenticateToken, catchAsync(async (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      admin: req.admin
    }
  });
}));

// Change password endpoint
router.put('/change-password', authenticateToken, catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters long'
    });
  }

  const admin = await RedisUtils.getAdminByEmail(req.admin.email);
  
  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
  
  // Update admin password
  admin.password = hashedNewPassword;
  admin.updatedAt = new Date().toISOString();
  
  await redisClient.setEx(`admin:${admin.email}`, 0, JSON.stringify(admin));

  logger.info(`Password changed for admin: ${req.admin.email}`);

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// Health check for auth service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'authentication',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;