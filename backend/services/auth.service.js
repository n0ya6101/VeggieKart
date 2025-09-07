const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// --- User Registration Logic ---
async function registerUser({name, phone, password }) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { phone } });
  if (existingUser) {
    throw new Error('User with this phone number already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      password: hashedPassword,
    },
  });
  return user;
}

async function loginUser({ phone, password }) {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    throw new Error('Invalid phone number or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid phone number or password.');
  }

  const token = jwt.sign(
    { userId: user.id, phone: user.phone, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, userId: user.id };
}

async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      id: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true
    }
  });
  return user;
}

module.exports = {
  registerUser,
  loginUser,
  getUserById
};
