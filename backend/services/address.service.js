const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const serviceablePincodes = "400001,400002,400003,400004,400005,400006,400007,400008,400009,400010".split(',');

async function getUserAddresses(userId) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' }, 
  });
}

async function createAddress(userId, addressData) {
  const { addressLine, pincode, city, isDefault } = addressData;

  if (!serviceablePincodes.includes(pincode)) {
    throw new Error('Sorry, we currently are only servicing select areas in Sambhajinagar. Please check the pincode and try again.');
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      userId,
      addressLine,
      pincode,
      city,
      state: 'Maharashtra',
      isDefault,
    },
  });
}


async function deleteAddress(userId, addressId) {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new Error('Address not found or you do not have permission to delete it.');
  }

  const addressCount = await prisma.address.count({ where: { userId } });
  if (addressCount <= 1) {
    throw new Error('You cannot delete your only address.');
  }

  return prisma.address.delete({
    where: { id: addressId },
  });
}


module.exports = { getUserAddresses, createAddress, deleteAddress };