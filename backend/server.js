require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const cors = require('@fastify/cors');
const Product = require('./models/Product');

fastify.register(cors, {
  origin: "http://localhost:3000",
});

fastify.get('/api/products', async (request, reply) => {
  try {
    const products = await Product.find({});
    reply.send(products);
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to fetch products' });
  }
});

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');

    await fastify.listen({ port: 5000 });
    console.log('Server is listening on port 5000.');

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();