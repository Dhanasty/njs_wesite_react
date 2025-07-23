const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

class Database {
  constructor(dbPath = 'admin_dashboard.db') {
    this.dbPath = path.resolve(dbPath);
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log(`📦 Connected to SQLite database: ${this.dbPath}`);
        this.initialize();
      }
    });
  }

  initialize() {
    // Create tables
    this.createTables()
      .then(() => this.createDefaultAdmin())
      .then(() => console.log('✅ Database initialized successfully'))
      .catch(err => console.error('❌ Database initialization failed:', err));
  }

  createTables() {
    return new Promise((resolve, reject) => {
      const tables = [
        // Admins table
        `CREATE TABLE IF NOT EXISTS admins (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'admin',
          isActive INTEGER NOT NULL DEFAULT 1,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )`,

        // Products table
        `CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          originalPrice REAL,
          category TEXT NOT NULL,
          badge TEXT,
          stockQuantity INTEGER NOT NULL DEFAULT 0,
          inStock INTEGER NOT NULL DEFAULT 0,
          images TEXT, -- JSON string
          features TEXT, -- JSON string
          colors TEXT, -- JSON string
          specifications TEXT, -- JSON string
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )`,

        // Sessions table (for demo, in production use proper session store)
        `CREATE TABLE IF NOT EXISTS sessions (
          sid TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          expires INTEGER
        )`
      ];

      let completed = 0;
      const total = tables.length;

      tables.forEach((sql, index) => {
        this.db.run(sql, (err) => {
          if (err) {
            reject(err);
            return;
          }
          completed++;
          if (completed === total) {
            resolve();
          }
        });
      });
    });
  }

  async createDefaultAdmin() {
    return new Promise((resolve, reject) => {
      // Check if admin already exists
      this.db.get(
        'SELECT id FROM admins WHERE email = ?',
        ['admin@navajothisilks.com'],
        async (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          if (!row) {
            // Create default admin
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'SecurePassword123!', 12);
            const admin = {
              id: 'admin-001',
              username: 'admin',
              email: 'admin@navajothisilks.com',
              password: hashedPassword,
              role: 'admin',
              isActive: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            this.db.run(
              `INSERT INTO admins (id, username, email, password, role, isActive, createdAt, updatedAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [admin.id, admin.username, admin.email, admin.password, admin.role, admin.isActive, admin.createdAt, admin.updatedAt],
              (err) => {
                if (err) {
                  reject(err);
                } else {
                  console.log('👤 Default admin created');
                  resolve();
                }
              }
            );
          } else {
            console.log('👤 Admin already exists');
            resolve();
          }
        }
      );
    });
  }

  // Admin methods
  getAdminByEmail(email) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM admins WHERE email = ? AND isActive = 1',
        [email],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  // Product methods
  getAllProducts() {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM products ORDER BY createdAt DESC',
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            // Parse JSON fields
            const products = rows.map(row => ({
              ...row,
              inStock: Boolean(row.inStock),
              images: row.images ? JSON.parse(row.images) : [],
              features: row.features ? JSON.parse(row.features) : [],
              colors: row.colors ? JSON.parse(row.colors) : [],
              specifications: row.specifications ? JSON.parse(row.specifications) : {}
            }));
            resolve(products);
          }
        }
      );
    });
  }

  getProductById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM products WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            // Parse JSON fields
            const product = {
              ...row,
              inStock: Boolean(row.inStock),
              images: row.images ? JSON.parse(row.images) : [],
              features: row.features ? JSON.parse(row.features) : [],
              colors: row.colors ? JSON.parse(row.colors) : [],
              specifications: row.specifications ? JSON.parse(row.specifications) : {}
            };
            resolve(product);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  createProduct(productData) {
    return new Promise((resolve, reject) => {
      const product = {
        id: productData.id || `product:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
        slug: productData.slug,
        name: productData.name,
        description: productData.description || '',
        price: productData.price,
        originalPrice: productData.originalPrice || productData.price,
        category: productData.category,
        badge: productData.badge || null,
        stockQuantity: productData.stockQuantity || 0,
        inStock: productData.inStock ? 1 : 0,
        images: JSON.stringify(productData.images || []),
        features: JSON.stringify(productData.features || []),
        colors: JSON.stringify(productData.colors || []),
        specifications: JSON.stringify(productData.specifications || {}),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.db.run(
        `INSERT INTO products (
          id, slug, name, description, price, originalPrice, category, badge,
          stockQuantity, inStock, images, features, colors, specifications,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id, product.slug, product.name, product.description,
          product.price, product.originalPrice, product.category, product.badge,
          product.stockQuantity, product.inStock, product.images, product.features,
          product.colors, product.specifications, product.createdAt, product.updatedAt
        ],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ ...product, inStock: Boolean(product.inStock) });
          }
        }
      );
    });
  }

  updateProduct(id, productData) {
    return new Promise((resolve, reject) => {
      const updates = {
        ...productData,
        inStock: productData.inStock ? 1 : 0,
        images: JSON.stringify(productData.images || []),
        features: JSON.stringify(productData.features || []),
        colors: JSON.stringify(productData.colors || []),
        specifications: JSON.stringify(productData.specifications || {}),
        updatedAt: new Date().toISOString()
      };

      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(id);

      this.db.run(
        `UPDATE products SET ${fields} WHERE id = ?`,
        values,
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  deleteProduct(id) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM products WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  close() {
    return new Promise((resolve) => {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('📦 Database connection closed');
        }
        resolve();
      });
    });
  }
}

module.exports = Database;