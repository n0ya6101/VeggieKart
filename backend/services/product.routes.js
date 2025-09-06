const productService = require('./product.service.js');

async function productRoutes(fastify, options) {

  // GET /api/products - Fetches all products
  fastify.get('/', async (request, reply) => {
    try {
      const products = await productService.getAllProducts();
      reply.send(products);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ message: 'Error fetching products' });
    }
  });

  // GET /api/products/:id - Fetches a single product by its ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const product = await productService.getProductById(id);
      if (!product) {
        return reply.status(404).send({ message: 'Product not found' });
      }
      reply.send(product);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ message: 'Error fetching product' });
    }
  });
}

module.exports = productRoutes;