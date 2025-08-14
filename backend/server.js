require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const cors = require('@fastify/cors');
const rateLimit = require('@fastify/rate-limit');

// Firebase Admin SDK
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID
});

// Models
const Product = require('./models/Product');
const User = require('./models/User');

// Register plugins
fastify.register(cors, {
  origin: "http://localhost:3000",
  credentials: true
});

fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// Firebase Auth middleware
const authenticateFirebase = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Find or create user in our database
    let user = await User.findByFirebaseUid(decodedToken.uid);
    
    if (!user) {
      // Create user if doesn't exist
      user = await User.createFromFirebase({
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
        phoneNumber: decodedToken.phone_number,
        photoURL: decodedToken.picture
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    request.user = {
      firebaseUid: decodedToken.uid,
      userId: user._id,
      email: decodedToken.email,
      role: user.role,
      mongoUser: user
    };
  } catch (err) {
    fastify.log.error('Firebase auth error:', err);
    reply.status(401).send({ error: 'Invalid or expired token' });
  }
};

// Validation schemas
const completeProfileSchema = {
  type: 'object',
  required: ['firstName', 'lastName'],
  properties: {
    firstName: { type: 'string', minLength: 2, maxLength: 50 },
    lastName: { type: 'string', minLength: 2, maxLength: 50 },
    phone: { type: 'string', pattern: '^[0-9]{10}$' },
    dateOfBirth: { type: 'string', format: 'date' },
    gender: { type: 'string', enum: ['male', 'female', 'other', 'prefer-not-to-say'] }
  }
};

const profileUpdateSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', minLength: 2, maxLength: 50 },
    lastName: { type: 'string', minLength: 2, maxLength: 50 },
    phone: { type: 'string', pattern: '^[0-9]{10}$' },
    dateOfBirth: { type: 'string', format: 'date' },
    gender: { type: 'string', enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
    addresses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['home', 'work', 'other'] },
          street: { type: 'string', minLength: 5 },
          city: { type: 'string', minLength: 2 },
          state: { type: 'string', minLength: 2 },
          pincode: { type: 'string', pattern: '^[0-9]{6}$' },
          country: { type: 'string', default: 'India' },
          landmark: { type: 'string' },
          isDefault: { type: 'boolean', default: false }
        },
        required: ['type', 'street', 'city', 'state', 'pincode']
      }
    }
  }
};

// Auth Routes - Firebase Integration

// Complete profile after Firebase registration
fastify.post('/api/auth/complete-profile', {
  preHandler: authenticateFirebase,
  schema: { body: completeProfileSchema }
}, async (request, reply) => {
  try {
    const user = request.user.mongoUser;
    const { firstName, lastName, phone, dateOfBirth, gender } = request.body;
    
    // Update profile
    user.profile.firstName = firstName;
    user.profile.lastName = lastName;
    if (phone) user.profile.phone = phone;
    if (dateOfBirth) user.profile.dateOfBirth = dateOfBirth;
    if (gender) user.profile.gender = gender;
    
    await user.save();
    
    reply.send({
      message: 'Profile completed successfully',
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        profile: user.profile,
        role: user.role
      }
    });
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to complete profile' });
  }
});

// Get current user profile
fastify.get('/api/auth/profile', {
  preHandler: authenticateFirebase
}, async (request, reply) => {
  try {
    const user = request.user.mongoUser;
    
    reply.send({
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      profile: user.profile,
      addresses: user.addresses,
      preferences: user.preferences,
      role: user.role,
      totalOrders: user.totalOrders,
      totalSpent: user.totalSpent,
      loyaltyPoints: user.loyaltyPoints,
      createdAt: user.createdAt
    });
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
fastify.put('/api/auth/profile', {
  preHandler: authenticateFirebase,
  schema: { body: profileUpdateSchema }
}, async (request, reply) => {
  try {
    const user = request.user.mongoUser;
    
    // Update profile fields
    if (request.body.firstName) user.profile.firstName = request.body.firstName;
    if (request.body.lastName) user.profile.lastName = request.body.lastName;
    if (request.body.phone) user.profile.phone = request.body.phone;
    if (request.body.dateOfBirth) user.profile.dateOfBirth = request.body.dateOfBirth;
    if (request.body.gender) user.profile.gender = request.body.gender;
    
    // Handle addresses
    if (request.body.addresses) {
      user.addresses = request.body.addresses;
    }
    
    await user.save();
    
    reply.send({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        addresses: user.addresses
      }
    });
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to update profile' });
  }
});

// Cart management routes
fastify.post('/api/cart/add', {
  preHandler: authenticateFirebase,
  schema: {
    body: {
      type: 'object',
      required: ['productId', 'unitName', 'quantity', 'price'],
      properties: {
        productId: { type: 'string' },
        unitName: { type: 'string' },
        quantity: { type: 'number', minimum: 1, maximum: 50 },
        price: { type: 'number', minimum: 0 }
      }
    }
  }
}, async (request, reply) => {
  try {
    const user = request.user.mongoUser;
    const { productId, unitName, quantity, price } = request.body;
    
    await user.addToCart(productId, unitName, quantity, price);
    
    reply.send({
      message: 'Item added to cart',
      cartCount: user.cartItems.length
    });
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to add item to cart' });
  }
});

fastify.delete('/api/cart/remove', {
  preHandler: authenticateFirebase,
  schema: {
    body: {
      type: 'object',
      required: ['productId', 'unitName'],
      properties: {
        productId: { type: 'string' },
        unitName: { type: 'string' }
      }
    }
  }
}, async (request, reply) => {
  try {
    const user = request.user.mongoUser;
    const { productId, unitName } = request.body;
    
    await user.removeFromCart(productId, unitName);
    
    reply.send({
      message: 'Item removed from cart',
      cartCount: user.cartItems.length
    });
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to remove item from cart' });
  }
});

fastify.get('/api/cart', {
  preHandler: authenticateFirebase
}, async (request, reply) => {
  try {
    const user = await User.findById(request.user.userId).populate('cartItems.product');
    
    reply.send({
      cartItems: user.cartItems,
      totalItems: user.cartItems.reduce((sum, item) => sum + item.quantity, 0),
      estimatedTotal: user.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to fetch cart' });
  }
});

// Wishlist routes
fastify.post('/api/wishlist/add', {
  preHandler: authenticateFirebase,
  schema: {
    body: {
      type: 'object',
      required: ['productId'],
      properties: {
        productId: { type: 'string' }
      }
    }
  }
}, async (request, reply) => {
  try {
    const user = request.user.mongoUser;
    const { productId } = request.body;
    
    await user.addToWishlist(productId);
    
    reply.send({ message: 'Item added to wishlist' });
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to add item to wishlist' });
  }
});

fastify.delete('/api/wishlist/remove', {
  preHandler: authenticateFirebase,
  schema: {
    body: {
      type: 'object',
      required: ['productId'],
      properties: {
        productId: { type: 'string' }
      }
    }
  }
}, async (request, reply) => {
  try {
    const user = request.user.mongoUser;
    const { productId } = request.body;
    
    await user.removeFromWishlist(productId);
    
    reply.send({ message: 'Item removed from wishlist' });
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to remove item from wishlist' });
  }
});

fastify.get('/api/wishlist', {
  preHandler: authenticateFirebase
}, async (request, reply) => {
  try {
    const user = await User.findById(request.user.userId).populate('wishlist.product');
    
    reply.send({ wishlist: user.wishlist });
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to fetch wishlist' });
  }
});

// Admin middleware
const requireAdmin = async (request, reply) => {
  await authenticateFirebase(request, reply);
  if (request.user.role !== 'admin') {
    reply.status(403).send({ error: 'Admin access required' });
  }
};

// Token verification endpoint
fastify.get('/api/auth/verify', {
  preHandler: authenticateFirebase
}, async (request, reply) => {
  reply.send({ 
    valid: true, 
    user: {
      id: request.user.userId,
      firebaseUid: request.user.firebaseUid,
      email: request.user.email,
      role: request.user.role
    }
  });
});

// Product routes (unchanged)
fastify.get('/api/products', async (request, reply) => {
  try {
    const { category, search, limit = 20, page = 1, sortBy = 'name' } = request.query;
    
    let filter = { isActive: true };
    if (category) filter.category = new RegExp(category, 'i');
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { 'description.details': new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(parseInt(limit)).sort(sortBy).lean(),
      Product.countDocuments(filter)
    ]);
    
    reply.send({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to fetch products' });
  }
});

fastify.get('/api/products/:id', async (request, reply) => {
  try {
    const product = await Product.findById(request.params.id).lean();
    if (!product) {
      return reply.status(404).send({ error: 'Product not found' });
    }
    reply.send(product);
  } catch (err) {
    if (err.name === 'CastError') {
      return reply.status(400).send({ error: 'Invalid product ID format' });
    }
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to fetch product' });
  }
});

// Admin product routes
fastify.post('/api/admin/products', {
  preHandler: requireAdmin,
  schema: {
    body: {
      type: 'object',
      required: ['name', 'category', 'allowedUnits'],
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        category: { 
          type: 'string', 
          enum: ['vegetable', 'fruit', 'dairy', 'grains', 'spices', 'beverages', 'snacks', 'frozen'] 
        },
        subcategory: { type: 'string' },
        imageUrl: { type: 'string' },
        allowedUnits: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['name', 'price'],
            properties: {
              name: { type: 'string' },
              price: { type: 'number', minimum: 0 },
              stock: { type: 'number', minimum: 0 },
              discountPercentage: { type: 'number', minimum: 0, maximum: 100 }
            }
          }
        }
      }
    }
  }
}, async (request, reply) => {
  try {
    const product = new Product(request.body);
    await product.save();
    
    reply.status(201).send({
      message: 'Product created successfully',
      product
    });
  } catch (err) {
    fastify.log.error(err);
    if (err.name === 'ValidationError') {
      return reply.status(400).send({ 
        error: 'Validation Error', 
        details: err.message 
      });
    }
    reply.status(500).send({ error: 'Failed to create product' });
  }
});

// User preferences
fastify.put('/api/user/preferences', {
  preHandler: authenticateFirebase,
  schema: {
    body: {
      type: 'object',
      properties: {
        newsletter: { type: 'boolean' },
        smsNotifications: { type: 'boolean' },
        emailNotifications: { type: 'boolean' },
        orderUpdates: { type: 'boolean' },
        currency: { type: 'string', enum: ['INR', 'USD', 'EUR'] },
        language: { type: 'string', enum: ['en', 'hi', 'ta', 'te', 'bn'] }
      }
    }
  }
}, async (request, reply) => {
  try {
    const user = request.user.mongoUser;
    
    Object.keys(request.body).forEach(key => {
      if (user.preferences[key] !== undefined) {
        user.preferences[key] = request.body[key];
      }
    });
    
    await user.save();
    
    reply.send({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to update preferences' });
  }
});

// Health check
fastify.get('/health', async (request, reply) => {
  try {
    await mongoose.connection.db.admin().ping();
    reply.send({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      firebase: 'initialized'
    });
  } catch (err) {
    reply.status(503).send({ 
      status: 'unhealthy', 
      error: 'Database connection failed' 
    });
  }
});

// Root endpoint
fastify.get('/', async (request, reply) => {
  return { 
    message: 'VeggieKart API with Firebase Authentication',
    version: '2.0.0',
    endpoints: [
      'POST /api/auth/complete-profile',
      'GET /api/auth/profile',
      'PUT /api/auth/profile',
      'GET /api/auth/verify',
      'POST /api/cart/add',
      'DELETE /api/cart/remove',
      'GET /api/cart',
      'POST /api/wishlist/add',
      'DELETE /api/wishlist/remove',
      'GET /api/wishlist',
      'PUT /api/user/preferences',
      'GET /api/products',
      'GET /api/products/:id',
      'POST /api/admin/products',
      'GET /health'
    ]
  };
});

// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  if (error.validation) {
    reply.status(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation
    });
    return;
  }
  
  reply.status(500).send({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully.');

    await fastify.listen({ 
      port: process.env.PORT || 5000,
      host: '0.0.0.0'
    });
    console.log(`Server is listening on port ${process.env.PORT || 5000}.`);

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  try {
    await fastify.close();
    await mongoose.disconnect();
    console.log('Server and database connections closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

start();