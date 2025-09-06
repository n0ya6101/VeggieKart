const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllProducts() {
  // Use Prisma Client to fetch all products and include their related units and description
  return prisma.product.findMany({
    include: {
      allowedUnits: true,
      description: true,
    },
  });
}

async function getProductById(id) {
  // Fetch a single product by its unique ID
  return prisma.product.findUnique({
    where: { id },
    include: {
      allowedUnits: true,
      description: true,
    },
  });
}

module.exports = {
  getAllProducts,
  getProductById,
};
