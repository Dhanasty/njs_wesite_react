const mongoose = require('mongoose');
const logger = require('./logger');
const Admin = require('../models/Admin');

// MongoDB connection configuration
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nava_jothi_silks';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoURI, options);

    logger.info('🍃 Connected to MongoDB database');
    
    // Initialize default admin user if not exists
    await initializeDefaultAdmin();
    
  } catch (error) {
    logger.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  logger.info('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.info('🔚 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('🛑 MongoDB connection closed through app termination');
  process.exit(0);
});

// Initialize default admin user
async function initializeDefaultAdmin() {
  try {
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@navajothisilks.com' });
    
    if (!adminExists) {
      const adminData = {
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@navajothisilks.com',
        password: process.env.ADMIN_PASSWORD || 'SecurePassword123!',
        role: 'superadmin',
        isActive: true
      };
      
      const admin = new Admin(adminData);
      await admin.save();
      
      logger.info('👤 Default admin user created');
      logger.info(`📧 Admin email: ${adminData.email}`);
      logger.info(`🔑 Admin password: ${process.env.ADMIN_PASSWORD || 'SecurePassword123!'}`);
    }
  } catch (error) {
    logger.error('❌ Failed to initialize default admin:', error);
  }
}

module.exports = {
  connectDB,
  mongoose
};