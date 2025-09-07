const orderService = require('./order.service.js');
const { authenticate } = require('../middleware/auth.middleware.js');

async function orderRoutes(fastify, options) {
  fastify.addHook('preHandler', authenticate);

  fastify.post('/', async (request, reply) => {
    try {
      const { userId } = request.user;
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
  
  fastify.get('/', async(request, reply) => {
      try {
        const { userId } = request.user;
        const orders = await orderService.getUserOrders(userId);
        reply.send(orders);
      } catch (error) {
         fastify.log.error(error);
         reply.status(500).send({ message: 'Error fetching orders' });
      }
  });

  fastify.get('/:id', async (request, reply) => {
    try {
      const { userId } = request.user;
      const { id } = request.params;
      const order = await orderService.getOrderById(userId, id);

      if (!order) {
        return reply.status(404).send({ message: 'Order not found' });
      }
      reply.send(order);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ message: 'Error fetching order details' });
    }
  });
}

module.exports = orderRoutes;