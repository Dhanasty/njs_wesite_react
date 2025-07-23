const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['Chettinad Silks', 'Soft Sico', 'Ikath'],
    trim: true
  },
  badge: {
    type: String,
    enum: ['Featured', 'Bestseller', 'New', 'Premium'],
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  colors: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      trim: true
    }
  }],
  specifications: {
    fabric: {
      type: String,
      trim: true
    },
    length: {
      type: String,
      trim: true
    },
    width: {
      type: String,
      trim: true
    },
    weight: {
      type: String,
      trim: true
    },
    washCare: [{
      type: String,
      trim: true
    }]
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ badge: 1 });
productSchema.index({ inStock: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stockQuantity <= 5) return 'low';
  if (this.stockQuantity <= 20) return 'medium';
  return 'high';
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);