const orderService = require('./order.service.js');
const { authenticate } = require('../middleware/auth.middleware.js');

async function orderRoutes(fastify, options) {
  // This hook protects all routes in this file
  fastify.addHook('preHandler', authenticate);

  // POST /api/orders - Create a new order
  fastify.post('/', async (request, reply) => {
    try {
      const { userId } = request.user; // Get userId from the authenticated token
      const { cart, shippingAddressId } = request.body;
      
      if (!cart || cart.length === 0 || !shippingAddressId) {
          return reply.status(400).send({ message: "Cart and shipping address are required." });
      }

      const order = await orderService.createOrder(userId, cart, shippingAddressId);
      reply.status(201).send(order);
    } catch (error) {
      fastify.log.error(error);
      reply.status(400).send({ message: error.message });
    }
  });
  
  // GET /api/orders - Get orders for the logged-in user
  fastify.get('/', async(request, reply) => {
      try {
        const { userId } = request.user; // Get userId from the authenticated token
        const orders = await orderService.getUserOrders(userId);
        reply.send(orders);
      } catch (error) {
         fastify.log.error(error);
         reply.status(500).send({ message: 'Error fetching orders' });
      }
  })
}

module.exports = orderRoutes;
