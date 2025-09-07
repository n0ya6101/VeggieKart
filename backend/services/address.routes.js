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
      reply.status(400).send({ message: error.message });
    }
  });


  fastify.delete('/:id', async (request, reply) => {
    try {
      const { userId } = request.user;
      const { id } = request.params;
      await addressService.deleteAddress(userId, id);
      reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      reply.status(400).send({ message: error.message });
    }
  });
}

module.exports = addressRoutes; 