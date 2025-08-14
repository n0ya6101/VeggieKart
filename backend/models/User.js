const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['home', 'work', 'other'],
    required: true
  },
  street: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    match: /^[0-9]{6}$/
  },
  country: {
    type: String,
    default: 'India'
  },
  landmark: {
    type: String,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  _id: true
});

const ProfileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  phone: {
    type: String,
    match: /^[0-9]{10}$/
    // Removed sparse: true to avoid duplicate index
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  avatar: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  }
}, { _id: false });

const PreferencesSchema = new mongoose.Schema({
  newsletter: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  orderUpdates: {
    type: Boolean,
    default: true
  },
  currency: {
    type: String,
    enum: ['INR', 'USD', 'EUR'],
    default: 'INR'
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'ta', 'te', 'bn'],
    default: 'en'
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  // Firebase UID as primary identifier
  firebaseUid: {
    type: String,
    required: true,
    unique: true
    // Removed index: true to avoid duplicate with schema.index()
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    // Removed index: true to avoid duplicate with schema.index()
  },
  // Remove password-related fields since Firebase handles auth
  profile: {
    type: ProfileSchema,
    required: true
  },
  addresses: [AddressSchema],
  role: {
    type: String,
    enum: ['customer', 'admin', 'vendor'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Firebase handles email verification
  lastLogin: {
    type: Date
  },
  // Remove login attempts and lock fields (Firebase handles this)
  preferences: {
    type: PreferencesSchema,
    default: () => ({})
  },
  // Shopping-related fields (unchanged)
  wishlist: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  cartItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    unitName: String,
    quantity: {
      type: Number,
      min: 1,
      max: 50
    },
    price: Number,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Analytics
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// All indexes are created automatically by Mongoose:
// - unique: true on email and firebaseUid creates indexes
// - timestamps: true creates indexes on createdAt and updatedAt  
// - No explicit indexes needed for this schema
UserSchema.index({ createdAt: -1 });
UserSchema.index({ lastLogin: -1 });

// Virtual for full name
UserSchema.virtual('profile.fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Pre-save middleware
UserSchema.pre('save', function(next) {
  // Ensure only one default address
  if (this.addresses && this.addresses.length > 0) {
    const defaultAddresses = this.addresses.filter(addr => addr.isDefault);
    if (defaultAddresses.length > 1) {
      this.addresses.forEach((addr, index) => {
        if (index > 0 && addr.isDefault) {
          addr.isDefault = false;
        }
      });
    }
    if (defaultAddresses.length === 0) {
      this.addresses[0].isDefault = true;
    }
  }
  next();
});

// Shopping methods (unchanged)
UserSchema.methods.addToCart = function(productId, unitName, quantity, price) {
  const existingItem = this.cartItems.find(
    item => item.product.toString() === productId && item.unitName === unitName
  );
  
  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + quantity, 50);
  } else {
    this.cartItems.push({
      product: productId,
      unitName,
      quantity: Math.min(quantity, 50),
      price
    });
  }
  
  return this.save();
};

UserSchema.methods.removeFromCart = function(productId, unitName) {
  this.cartItems = this.cartItems.filter(
    item => !(item.product.toString() === productId && item.unitName === unitName)
  );
  return this.save();
};

UserSchema.methods.clearCart = function() {
  this.cartItems = [];
  return this.save();
};

UserSchema.methods.addToWishlist = function(productId) {
  const exists = this.wishlist.find(
    item => item.product.toString() === productId
  );
  
  if (!exists) {
    this.wishlist.push({ product: productId });
    return this.save();
  }
  
  return Promise.resolve(this);
};

UserSchema.methods.removeFromWishlist = function(productId) {
  this.wishlist = this.wishlist.filter(
    item => item.product.toString() !== productId
  );
  return this.save();
};

// Static methods
UserSchema.statics.findByFirebaseUid = function(firebaseUid) {
  return this.findOne({ firebaseUid });
};

UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.createFromFirebase = async function(firebaseUser, additionalData = {}) {
  const userData = {
    firebaseUid: firebaseUser.uid,
    email: firebaseUser.email,
    profile: {
      firstName: additionalData.firstName || firebaseUser.displayName?.split(' ')[0] || '',
      lastName: additionalData.lastName || firebaseUser.displayName?.split(' ')[1] || '',
      phone: firebaseUser.phoneNumber || additionalData.phone || '',
      avatar: firebaseUser.photoURL || additionalData.avatar || ''
    },
    ...additionalData
  };
  
  return this.create(userData);
};

UserSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

UserSchema.statics.getCustomerStats = async function() {
  const stats = await this.aggregate([
    { $match: { role: 'customer' } },
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
        activeCustomers: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        totalSpent: { $sum: '$totalSpent' },
        avgOrderValue: { $avg: { $divide: ['$totalSpent', '$totalOrders'] } }
      }
    }
  ]);
  
  return stats[0] || {};
};

module.exports = mongoose.model('User', UserSchema);