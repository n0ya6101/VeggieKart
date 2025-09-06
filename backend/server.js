require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');

// Import services
const productService = require('./services/product.service');
const authService = require('./services/auth.service'); // Import the auth service
const productRoutes = require('./services/product.routes.js');
const authRoutes = require('./services/auth.routes.js');
const orderRoutes = require('./services/order.routes.js'); 
const addressRoutes = require('./services/address.routes.js');

// Register CORS
fastify.register(cors, {
  origin: "http://localhost:3000",
});

// Product Routes
fastify.register(productRoutes, { prefix: '/api/products' });

// Auth Routes
fastify.register(authRoutes, { prefix: '/api/auth' });

// Order Routes
fastify.register(orderRoutes, { prefix: '/api/orders' }); 

// Address Routes   
fastify.register(addressRoutes, { prefix: '/api/addresses' });



// --- Server Start Logic ---
const start = async () => {
  try {
    await fastify.listen({ port: 5001 });
    console.log('API Gateway running on port 5001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();