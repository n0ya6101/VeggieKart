const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Unit name is required'],
    trim: true 
  }, 
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPercentage: { 
    type: Number, 
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  _id: false // Prevent automatic _id generation for subdocuments
});

// Add a virtual for discounted price
UnitSchema.virtual('discountedPrice').get(function() {
  return this.price - (this.price * this.discountPercentage / 100);
});

const NutritionSchema = new mongoose.Schema({
  calories: { type: Number, min: 0 },
  protein: { type: Number, min: 0 },
  carbohydrates: { type: Number, min: 0 },
  fat: { type: Number, min: 0 },
  fiber: { type: Number, min: 0 },
  sugar: { type: Number, min: 0 },
  sodium: { type: Number, min: 0 },
  vitamins: [String],
  minerals: [String]
}, { _id: false });

const DescriptionSchema = new mongoose.Schema({
  unit: {
    type: String,
    default: 'per item'
  },
  details: {
    type: String,
    trim: true
  },
  healthBenefits: {
    type: String,
    trim: true
  },
  serveSize: String,
  shelfLife: String,
  storageInstructions: String,
  returnPolicy: {
    type: String,
    default: '7 days return policy'
  },
  countryOfOrigin: {
    type: String,
    required: [true, 'Country of origin is required']
  },
  seller: {
    type: String,
    required: [true, 'Seller information is required']
  },
  sellerFSSAI: String,
  foodAdditivesInfo: String,
  disclaimer: String,
  customerCareDetails: {
    email: {
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: String
  },
  nutrition: NutritionSchema
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: {
      values: ['vegetable', 'fruit', 'dairy', 'grains', 'spices', 'beverages', 'snacks', 'frozen'],
      message: 'Category must be one of: vegetable, fruit, dairy, grains, spices, beverages, snacks, frozen'
    }
  },
  subcategory: {
    type: String,
    trim: true
  },
  imageUrl: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  allowedUnits: {
    type: [UnitSchema],
    validate: {
      validator: function(units) {
        return units && units.length > 0;
      },
      message: 'At least one unit must be provided'
    }
  },
  maxOrderLimit: { 
    type: Number, 
    default: 10,
    min: [1, 'Maximum order limit must be at least 1']
  },
  description: DescriptionSchema,
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seasonality: {
    type: String,
    enum: ['year-round', 'seasonal', 'limited'],
    default: 'year-round'
  },
  origin: {
    farm: String,
    location: String,
    organic: { type: Boolean, default: false }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ name: 'text', 'description.details': 'text' }); // Text search
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ 'rating.average': -1 });

// Virtual for checking if product is in stock
ProductSchema.virtual('inStock').get(function() {
  return this.allowedUnits.some(unit => unit.stock > 0 && unit.isAvailable);
});

// Virtual for getting the minimum price
ProductSchema.virtual('minPrice').get(function() {
  if (!this.allowedUnits || this.allowedUnits.length === 0) return 0;
  return Math.min(...this.allowedUnits.map(unit => unit.discountedPrice));
});

// Pre-save middleware to ensure at least one unit is available
ProductSchema.pre('save', function(next) {
  // Auto-generate tags from name and category
  if (!this.tags || this.tags.length === 0) {
    this.tags = [
      ...this.name.toLowerCase().split(' '),
      this.category.toLowerCase()
    ].filter(tag => tag.length > 2);
  }
  
  // Ensure imageUrl is set from images if available
  if (!this.imageUrl && this.images && this.images.length > 0) {
    const primaryImage = this.images.find(img => img.isPrimary) || this.images[0];
    this.imageUrl = primaryImage.url;
  }
  
  next();
});

// Static method to get products by category
ProductSchema.statics.getByCategory = function(category, options = {}) {
  const { limit = 10, page = 1, sortBy = 'name' } = options;
  const skip = (page - 1) * limit;
  
  return this.find({ 
    category, 
    isActive: true,
    inStock: true 
  })
  .sort(sortBy)
  .skip(skip)
  .limit(limit)
  .lean();
};

// Instance method to check if product can be ordered
ProductSchema.methods.canOrder = function(unitName, quantity) {
  const unit = this.allowedUnits.find(u => u.name === unitName);
  if (!unit) return { canOrder: false, reason: 'Unit not available' };
  if (!unit.isAvailable) return { canOrder: false, reason: 'Unit temporarily unavailable' };
  if (unit.stock < quantity) return { canOrder: false, reason: 'Insufficient stock' };
  if (quantity > this.maxOrderLimit) return { canOrder: false, reason: 'Exceeds maximum order limit' };
  
  return { canOrder: true };
};

module.exports = mongoose.model('Product', ProductSchema);