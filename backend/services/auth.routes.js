const authService = require('./auth.service');
const { authenticate } = require('../middleware/auth.middleware');

async function authRoutes(fastify, options) {
  // --- Registration Route ---
  fastify.post('/register', async (request, reply) => {
    try {
      const { name, phone, password } = request.body;
      if (!phone || !password) {
        return reply.status(400).send({ message: 'Phone and password are required.' });
      }
      const user = await authService.registerUser({ name, phone, password });
      reply.status(201).send({ message: 'User created successfully', userId: user.id });
    } catch (error) {
      reply.status(409).send({ message: error.message });
    }
  });

  // --- Login Route ---
  fastify.post('/login', async (request, reply) => {
    try {
      const { phone, password } = request.body;
       if (!phone || !password) {
        return reply.status(400).send({ message: 'Phone and password are required.' });
      }
      const { token, userId } = await authService.loginUser({ phone, password });
      reply.send({ token, userId, message: 'Login successful' });
    } catch (error) {
      reply.status(401).send({ message: error.message });
    }
  });

  fastify.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const user = await authService.getUserById(request.user.userId);
      if (!user) {
        return reply.status(404).send({ message: 'User not found' });
      }
      reply.send(user);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ message: "Error fetching user profile" });
    }
  });
}

module.exports = authRoutes;
