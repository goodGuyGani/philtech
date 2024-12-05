const prisma = require("../utils/prisma-client");

const getAllMerchants = async (req, res) => {
  try {
    const merchants = await prisma.merchant.findMany();
    res.status(200).json(merchants);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while fetching transactions" });
  }
};

module.exports = { getAllMerchants };
