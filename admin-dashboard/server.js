const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/mongodb');
const logger = require('./config/logger');
const authRoutes = require('./routes/auth-mongo');
const productRoutes = require('./routes/products-mongo');
const uploadRoutes = require('./routes/upload');
const publicRoutes = require('./routes/public-mongo');
const orderRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory');
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth-mongo');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting (disabled for development)
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 1) * 60 * 1000, // 1 minute for dev
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 1000, // Higher limit for dev
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
// app.use('/api/', limiter); // Commented out for development

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3002').split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Session configuration (using memory store for development)
app.use(session({
  secret: process.env.SESSION_SECRET || 'nava-jothi-silks-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_EXPIRE) || 86400000 // 24 hours
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Debug endpoint for testing
app.post('/api/test', (req, res) => {
  console.log('Test endpoint hit:', req.body);
  res.json({ success: true, message: 'Test endpoint working', data: req.body });
});

// Proxy route for Next.js images
app.get('/proxy/nextjs-images/*', (req, res) => {
  const imagePath = req.path.replace('/proxy/nextjs-images', '');
  const nextjsUrl = `http://localhost:3002${imagePath}`;
  
  console.log('Proxying image request:', nextjsUrl);
  
  // Use Node.js http module for better compatibility
  const http = require('http');
  const url = require('url');
  
  const parsedUrl = url.parse(nextjsUrl);
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 80,
    path: parsedUrl.path,
    method: 'GET'
  };
  
  const proxyReq = http.request(options, (proxyRes) => {
    if (proxyRes.statusCode === 200) {
      const contentType = proxyRes.headers['content-type'] || 'image/jpeg';
      res.set('Content-Type', contentType);
      res.set('Cache-Control', 'public, max-age=3600');
      proxyRes.pipe(res);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  });
  
  proxyReq.on('error', (error) => {
    console.error('Image proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy image' });
  });
  
  proxyReq.end();
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', authenticateToken, productRoutes);
app.use('/api/upload', authenticateToken, uploadRoutes);
app.use('/api/public', publicRoutes);

// Orders routes with conditional authentication
app.use('/api/orders', (req, res, next) => {
  // Allow POST requests from external sources (Next.js site) without authentication
  if (req.method === 'POST') {
    next();
  } else {
    // Require authentication for GET, PUT, DELETE operations
    authenticateToken(req, res, next);
  }
}, orderRoutes);

app.use('/api/inventory', authenticateToken, inventoryRoutes);

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Connect to MongoDB and start server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Admin Dashboard Server running on port ${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
  });
}).catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;