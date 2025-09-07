const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Generates the next sequential ID for a given entity type (e.g., 'order', 'product').
 * This function is designed to be safe from race conditions.
 * @param {string} sequenceName - The name of the sequence ('order', 'product', etc.).
 * @param {string} prefix - The prefix for the ID (e.g., 'ORD-', 'PROD-').
 * @param {number} padLength - The minimum length of the numeric part, padded with zeros.
 * @returns {Promise<string>} The next formatted ID in the sequence.
 */
async function generateNextId(sequenceName, prefix, padLength = 6) {
  // Use a transaction to ensure atomicity (prevents race conditions)
  const result = await prisma.$transaction(async (tx) => {
    const sequence = await tx.idSequence.update({
      where: { name: sequenceName },
      data: { value: { increment: 1 } },
    });
    return sequence.value;
  });

  const paddedId = String(result).padStart(padLength, '0');
  return `${prefix}${paddedId}`;
}

module.exports = { generateNextId };