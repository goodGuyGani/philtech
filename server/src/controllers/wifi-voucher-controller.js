const prisma = require("../utils/prisma-client");

const createWifiVouchers = async (vouchers) => {
  try {
    // Create vouchers in the database
    const result = await prisma.pt_wifi_voucher.createMany({
      data: vouchers,
    });

    return result;
  } catch (error) {
    console.error("Error creating vouchers:", error);
    throw new Error("Failed to create vouchers");
  }
};

const getAllWifiVouchers = async (req, res) => {
  try {
    const wifi_voucher = await prisma.pt_wifi_voucher.findMany();
    res.status(200).json(wifi_voucher);
  } catch (error) {
    req
      .sendStatus(500)
      .json({ error: "Something went wrong while fetching wifi voucher" });
  }
};

module.exports = { createWifiVouchers, getAllWifiVouchers };
