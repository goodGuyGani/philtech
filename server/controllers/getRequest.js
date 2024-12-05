const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getVouchers = async () => {
  try {
    return await prisma.voucher.findMany();
  } catch (error) {
    throw new Error('Failed to fetch Vouchers');
  }
};

module.exports = { getVouchers};