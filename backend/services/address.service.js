const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const serviceablePincodes = process.env.SERVICEABLE_PINCODES.split(',');

async function getUserAddresses(userId) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' }, 
  });
}

async function createAddress(userId, addressData) {
  const { addressLine, pincode, city, state, isDefault } = addressData;

  
  

  if (!serviceablePincodes.includes(pincode)) {
    throw new Error('Sorry, we currently are only servicing select areas in Sambhajinagar. Please check the pincode and try again.');
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      userId,
      addressLine,
      pincode,
      city,
      state,
      isDefault,
    },
  });
}


module.exports = { getUserAddresses, createAddress };