const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const path = require('path');
const Database = require('./database');
require('dotenv').config();

// Initialize SQLite database
const db = new Database();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');
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

// Session configuration (in-memory for demo)
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 86400000 // 24 hours
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
    environment: process.env.NODE_ENV || 'development'
  });
});

// Auth middleware with SQLite
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required'
    });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    const admin = await db.getAdminByEmail(decoded.email);
    
    if (!admin || !admin.isActive) {
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
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Auth routes with SQLite
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const admin = await db.getAdminByEmail(email);
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    req.session.adminId = admin.id;
    req.session.adminEmail = admin.email;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  req.session.destroy();
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: { admin: req.admin }
  });
});

// Products routes with SQLite
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const products = await db.getAllProducts();
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total: products.length,
          limit: 50,
          offset: 0,
          hasMore: false
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const product = await db.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

app.get('/api/products/stats/overview', authenticateToken, async (req, res) => {
  try {
    const products = await db.getAllProducts();
    const stats = {
      totalProducts: products.length,
      categories: {},
      totalInventoryValue: 0,
      lowStockProducts: 0
    };

    products.forEach(product => {
      stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;
      stats.totalInventoryValue += (product.price * product.stockQuantity);
      if (product.stockQuantity < 10) {
        stats.lowStockProducts++;
      }
    });

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
});

app.get('/api/products/alerts/low-stock', authenticateToken, async (req, res) => {
  try {
    const products = await db.getAllProducts();
    const lowStockProducts = products.filter(product => product.stockQuantity <= 10);

    res.json({
      success: true,
      data: {
        count: lowStockProducts.length,
        products: lowStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock products',
      error: error.message
    });
  }
});

// Public API endpoints for main website (no auth required)
app.get('/api/public/products', async (req, res) => {
  try {
    const products = await db.getAllProducts();
    // Only return public fields
    const publicProducts = products.map(product => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      badge: product.badge,
      inStock: product.inStock,
      images: product.images,
      features: product.features,
      colors: product.colors,
      specifications: product.specifications
    }));
    
    res.json({
      success: true,
      data: publicProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

app.get('/api/public/products/slug/:slug', async (req, res) => {
  try {
    const products = await db.getAllProducts();
    const product = products.find(p => p.slug === req.params.slug);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Return public fields only
    const publicProduct = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      badge: product.badge,
      inStock: product.inStock,
      images: product.images,
      features: product.features,
      colors: product.colors,
      specifications: product.specifications
    };

    res.json({
      success: true,
      data: publicProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

app.get('/api/public/products/category/:category', async (req, res) => {
  try {
    const products = await db.getAllProducts();
    const categoryProducts = products.filter(p => p.category === req.params.category);
    
    // Return public fields only
    const publicProducts = categoryProducts.map(product => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      badge: product.badge,
      inStock: product.inStock,
      images: product.images,
      features: product.features,
      colors: product.colors,
      specifications: product.specifications
    }));

    res.json({
      success: true,
      data: publicProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category',
      error: error.message
    });
  }
});

app.get('/api/public/products/featured', async (req, res) => {
  try {
    const products = await db.getAllProducts();
    const featuredProducts = products
      .filter(p => p.badge === 'Featured' || p.badge === 'Bestseller')
      .slice(0, 4);
    
    // Return public fields only
    const publicProducts = featuredProducts.map(product => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      badge: product.badge,
      inStock: product.inStock,
      images: product.images,
      features: product.features,
      colors: product.colors,
      specifications: product.specifications
    }));

    res.json({
      success: true,
      data: publicProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
});

// Serve static HTML for demo
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Nava Jothi Silks - Admin Dashboard</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
            .btn { background: #10b981; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; display: inline-block; }
            .info { background: #e0f2fe; padding: 20px; border-radius: 6px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Admin Dashboard is Running!</h1>
            <div class="info">
                <h3>Default Login Credentials:</h3>
                <p><strong>Email:</strong> admin@navajothisilks.com</p>
                <p><strong>Password:</strong> SecurePassword123!</p>
            </div>
            <div class="info">
                <h3>API Endpoints Available:</h3>
                <ul>
                    <li><strong>POST</strong> /api/auth/login - Admin login</li>
                    <li><strong>GET</strong> /api/products - Get all products</li>
                    <li><strong>POST</strong> /api/products - Create product</li>
                    <li><strong>GET</strong> /api/products/stats/overview - Get stats</li>
                    <li><strong>GET</strong> /health - Health check</li>
                </ul>
            </div>
            <div class="info">
                <p><strong>Status:</strong> ✅ Backend is running successfully!</p>
                <p><strong>Storage:</strong> In-memory (demo mode)</p>
                <p><strong>Next Steps:</strong> Add Redis for persistent storage in production</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Admin Dashboard Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Dashboard: http://localhost:${PORT}`);
  console.log(`📧 Default admin: admin@navajothisilks.com`);
  console.log(`🔑 Default password: SecurePassword123!`);
});

module.exports = app;