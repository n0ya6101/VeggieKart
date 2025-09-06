const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createOrder(userId, cart, shippingAddressId) {
  // Prisma's interactive transaction ensures all operations succeed or none do.
  return prisma.$transaction(async (tx) => {
    // 1. Verify stock for all items in the cart
    for (const item of cart) {
      const inventory = await tx.inventory.findUnique({
        where: { unitId: item.unit.id },
      });

      if (!inventory || inventory.quantity < item.quantity) {
        throw new Error(`Not enough stock for ${item.name} (${item.unit.name})`);
      }
    }

    // 2. If stock is sufficient, decrement inventory for each item
    const stockUpdates = cart.map(item => 
      tx.inventory.update({
        where: { unitId: item.unit.id },
        data: { quantity: { decrement: item.quantity } },
      })
    );
    await Promise.all(stockUpdates);

    // 3. Calculate total amount based on current prices
    const totalAmount = cart.reduce((sum, item) => {
      const price = item.unit.discountPercentage > 0
        ? item.unit.price - (item.unit.price * (item.unit.discountPercentage / 100))
        : item.unit.price;
      return sum + (price * item.quantity);
    }, 0);

    // 4. Create the Order and OrderItems
    const order = await tx.order.create({
      data: {
        userId,
        shippingAddressId,
        totalAmount,
        status: 'CONFIRMED',
        items: {
          create: cart.map(item => ({
            productId: item.productId,
            unitId: item.unit.id,
            quantity: item.quantity,
            priceAtPurchase: item.unit.price, // Store the original price
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  });
}

async function getUserOrders(userId) {
    return prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { 
            items: {
                include: {
                    product: true,
                    unit: true
                }
            }
        }
    });
}

module.exports = { createOrder, getUserOrders };