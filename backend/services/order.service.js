const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateNextId } = require('./id.service.js');

async function createOrder(userId, cart, shippingAddressId) {
  if (!cart || cart.length === 0) {
    throw new Error("Cart cannot be empty.");
  }

  const newOrderId = await generateNextId('order', 'ORD-');

  return prisma.$transaction(async (tx) => {
    let calculatedTotal = 0;
    
    const unitIds = cart.map(item => item.unitId);
    
    const unitsInDb = await tx.unit.findMany({
      where: { id: { in: unitIds } },
      include: { 
        inventory: true, 
        product: true 
      }
    });

    const unitsMap = new Map(unitsInDb.map(u => [u.id, u]));

    for (const item of cart) {
      const unitFromDb = unitsMap.get(item.unitId);

      if (!unitFromDb) {
        throw new Error(`An item in your cart is no longer available.`);
      }

      if (!unitFromDb.inventory || unitFromDb.inventory.quantity < item.quantity) {
        throw new Error(`Not enough stock for ${unitFromDb.product.name} (${unitFromDb.name}). Only ${unitFromDb.inventory?.quantity || 0} left.`);
      }

      const price = unitFromDb.discountPercentage > 0
        ? unitFromDb.price - (unitFromDb.price * (unitFromDb.discountPercentage / 100))
        : unitFromDb.price;
      calculatedTotal += price * item.quantity;
    }

    const stockUpdates = cart.map(item =>
      tx.inventory.update({
        where: { unitId: item.unitId },
        data: { quantity: { decrement: item.quantity } },
      })
    );
    await Promise.all(stockUpdates);

    const order = await tx.order.create({
      data: {
        id: newOrderId,
        userId,
        shippingAddressId,
        totalAmount: calculatedTotal,
        status: 'CONFIRMED',
        items: {
          create: cart.map(item => {
            const unitFromDb = unitsMap.get(item.unitId);
            return {
              productId: unitFromDb.productId,
              unitId: item.unitId,
              quantity: item.quantity,
              priceAtPurchase: unitFromDb.price,
            };
          }),
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

async function getOrderById(userId, orderId) {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId,
    },
    include: {
      items: {
        include: {
          product: true,
          unit: true,
        },
      },
      shippingAddress: true,
    },
  });
}

module.exports = { createOrder, getUserOrders, getOrderById };