const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createVouchers = async (vouchers) => {
  try {
    // Create vouchers in the database
    const result = await prisma.voucher.createMany({
      data: vouchers,
    });

    return result;
  } catch (error) {
    console.error('Error creating vouchers:', error);
    throw new Error('Failed to create vouchers');
  }
};

module.exports = { createVouchers };
