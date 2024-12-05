const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createTvVouchers = async (vouchers) => {
  try {
    const result = await prisma.pt_tv_voucher.createMany({
      data: vouchers,
    });

    return result;
  } catch (error) {
    console.error("Error creating vouchers:", error);
    throw new Error("Failed to create vouchers");
  }
};

const getAllTvVouchers = async (req, res) => {
  try {
    const tv_voucher = await prisma.pt_tv_voucher.findMany();
    res.status(200).json(tv_voucher);
  } catch (error) {
    res
      .sendStatus(500)
      .json({ error: "Something went wrong while fetching tv voucher" });
  }
};

module.exports = {
  createTvVouchers,
  getAllTvVouchers,
};
