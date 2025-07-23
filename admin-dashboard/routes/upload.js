const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');
const { requireAdmin } = require('../middleware/auth-mongo');
const { validateFileUpload } = require('../middleware/validation');
const { catchAsync } = require('../middleware/errorHandler');

const router = express.Router();

// Ensure upload directories exist
const ensureUploadDirs = async () => {
  const dirs = [
    path.join(__dirname, '../uploads'),
    path.join(__dirname, '../uploads/products'),
    path.join(__dirname, '../uploads/products/thumbnails')
  ];
  
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      logger.info(`Created upload directory: ${dir}`);
    }
  }
};

// Initialize upload directories
ensureUploadDirs();

// Multer configuration
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    files: 5 // Maximum 5 files per request
  }
});

// Image processing utility
const processImage = async (buffer, filename, options = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 85,
    format = 'jpeg'
  } = options;

  let processor = sharp(buffer)
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    });

  if (format === 'jpeg') {
    processor = processor.jpeg({ quality });
  } else if (format === 'png') {
    processor = processor.png({ quality });
  } else if (format === 'webp') {
    processor = processor.webp({ quality });
  }

  return processor.toBuffer();
};

// Upload product images
router.post('/products', requireAdmin, upload.array('images', 5), validateFileUpload, catchAsync(async (req, res) => {
  const uploadedFiles = [];
  const errors = [];

  try {
    for (const file of req.files) {
      try {
        const fileId = uuidv4();
        const timestamp = Date.now();
        const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        
        // Generate filenames
        const mainFilename = `${timestamp}_${fileId}_${originalName}`;
        const thumbFilename = `thumb_${timestamp}_${fileId}_${originalName}`;
        
        // Process main image (800x600)
        const mainImageBuffer = await processImage(file.buffer, mainFilename, {
          width: 800,
          height: 600,
          quality: 85,
          format: 'jpeg'
        });
        
        // Process thumbnail (300x225)
        const thumbnailBuffer = await processImage(file.buffer, thumbFilename, {
          width: 300,
          height: 225,
          quality: 80,
          format: 'jpeg'
        });

        // File paths
        const mainPath = path.join(__dirname, '../uploads/products', mainFilename);
        const thumbPath = path.join(__dirname, '../uploads/products/thumbnails', thumbFilename);

        // Save files
        await fs.writeFile(mainPath, mainImageBuffer);
        await fs.writeFile(thumbPath, thumbnailBuffer);

        // Generate URLs
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const mainUrl = `${baseUrl}/uploads/products/${mainFilename}`;
        const thumbUrl = `${baseUrl}/uploads/products/thumbnails/${thumbFilename}`;

        uploadedFiles.push({
          id: fileId,
          filename: mainFilename,
          originalName: file.originalname,
          mimetype: 'image/jpeg',
          size: mainImageBuffer.length,
          url: mainUrl,
          thumbnail: thumbUrl,
          uploadedAt: new Date().toISOString()
        });

        logger.info(`Image uploaded: ${mainFilename} by ${req.admin.email}`);

      } catch (error) {
        logger.error(`Error processing file ${file.originalname}:`, error);
        errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `${uploadedFiles.length} images uploaded successfully`,
      data: {
        files: uploadedFiles,
        errors: errors.length > 0 ? errors : undefined
      }
    });

  } catch (error) {
    logger.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
}));

// Upload single image
router.post('/products/single', requireAdmin, upload.single('image'), catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Image file is required'
    });
  }

  try {
    const fileId = uuidv4();
    const timestamp = Date.now();
    const originalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    const mainFilename = `${timestamp}_${fileId}_${originalName}`;
    const thumbFilename = `thumb_${timestamp}_${fileId}_${originalName}`;
    
    // Process images
    const mainImageBuffer = await processImage(req.file.buffer, mainFilename, {
      width: 800,
      height: 600,
      quality: 85,
      format: 'jpeg'
    });
    
    const thumbnailBuffer = await processImage(req.file.buffer, thumbFilename, {
      width: 300,
      height: 225,
      quality: 80,
      format: 'jpeg'
    });

    // Save files
    const mainPath = path.join(__dirname, '../uploads/products', mainFilename);
    const thumbPath = path.join(__dirname, '../uploads/products/thumbnails', thumbFilename);
    
    await fs.writeFile(mainPath, mainImageBuffer);
    await fs.writeFile(thumbPath, thumbnailBuffer);

    // Generate URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const mainUrl = `${baseUrl}/uploads/products/${mainFilename}`;
    const thumbUrl = `${baseUrl}/uploads/products/thumbnails/${thumbFilename}`;

    const uploadedFile = {
      id: fileId,
      filename: mainFilename,
      originalName: req.file.originalname,
      mimetype: 'image/jpeg',
      size: mainImageBuffer.length,
      url: mainUrl,
      thumbnail: thumbUrl,
      uploadedAt: new Date().toISOString()
    };

    logger.info(`Single image uploaded: ${mainFilename} by ${req.admin.email}`);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: { file: uploadedFile }
    });

  } catch (error) {
    logger.error('Single upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
}));

// Delete uploaded image
router.delete('/products/:filename', requireAdmin, catchAsync(async (req, res) => {
  const { filename } = req.params;
  
  // Validate filename to prevent directory traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid filename'
    });
  }

  try {
    const mainPath = path.join(__dirname, '../uploads/products', filename);
    const thumbFilename = filename.startsWith('thumb_') ? filename : `thumb_${filename}`;
    const thumbPath = path.join(__dirname, '../uploads/products/thumbnails', thumbFilename);

    // Delete files
    const deletePromises = [];
    
    try {
      await fs.access(mainPath);
      deletePromises.push(fs.unlink(mainPath));
    } catch {
      // File doesn't exist, ignore
    }

    try {
      await fs.access(thumbPath);
      deletePromises.push(fs.unlink(thumbPath));
    } catch {
      // Thumbnail doesn't exist, ignore
    }

    if (deletePromises.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    await Promise.all(deletePromises);

    logger.info(`Image deleted: ${filename} by ${req.admin.email}`);

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: { filename }
    });

  } catch (error) {
    logger.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error.message
    });
  }
}));

// Get upload statistics
router.get('/stats', requireAdmin, catchAsync(async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads/products');
    const files = await fs.readdir(uploadsDir);
    
    let totalSize = 0;
    const fileStats = [];

    for (const file of files) {
      try {
        const filePath = path.join(uploadsDir, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
        fileStats.push({
          filename: file,
          size: stats.size,
          uploadedAt: stats.birthtime
        });
      } catch {
        // Skip files that can't be accessed
      }
    }

    res.json({
      success: true,
      data: {
        totalFiles: fileStats.length,
        totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        files: fileStats.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      }
    });

  } catch (error) {
    logger.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upload statistics',
      error: error.message
    });
  }
}));

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'file-upload',
    timestamp: new Date().toISOString(),
    maxFileSize: process.env.MAX_FILE_SIZE || '5MB',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
});

module.exports = router;