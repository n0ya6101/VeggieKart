const addressService = require('./address.service.js');
const { authenticate } = require('../middleware/auth.middleware.js');

async function addressRoutes(fastify, options) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', async (request, reply) => {
    try {
      const { userId } = request.user;
      const addresses = await addressService.getUserAddresses(userId);
      reply.send(addresses);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ message: 'Error fetching addresses' });
    }
  });

  fastify.post('/', async (request, reply) => {
    try {
      const { userId } = request.user;
      const address = await addressService.createAddress(userId, request.body);
      reply.status(201).send(address);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ message: 'Error creating address' });
    }
  });
}

module.exports = addressRoutes;