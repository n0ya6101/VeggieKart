require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');

const productService = require('./services/product.service');
const authService = require('./services/auth.service'); 
const productRoutes = require('./services/product.routes.js');
const authRoutes = require('./services/auth.routes.js');
const orderRoutes = require('./services/order.routes.js'); 
const addressRoutes = require('./services/address.routes.js');

fastify.register(cors, {
  origin: "https://veggiekart-web.onrender.com",
});

fastify.register(productRoutes, { prefix: '/api/products' });

fastify.register(authRoutes, { prefix: '/api/auth' });

fastify.register(orderRoutes, { prefix: '/api/orders' }); 
   
fastify.register(addressRoutes, { prefix: '/api/addresses' });


const start = async () => {
  try {
    await fastify.listen({ port: 5001, host: '0.0.0.0' }); 
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
} else {
  module.exports = { start };
}