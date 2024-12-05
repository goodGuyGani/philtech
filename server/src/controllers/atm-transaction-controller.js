const prisma = require("../utils/prisma-client");

const createAtmTransactions = async (transactions) => {
  try {
    const result = await prisma.pt_atm_transaction.createMany({
      data: transactions,
    });

    return result;
  } catch (error) {
    console.error("Error creating transactions:", error);
    throw new Error("Failed to create transactions");
  }
};

const getAllAtmTransaction = async (req, res) => {
  try {
    const atm_transaction = await prisma.pt_atm_transaction.findMany();
    res.status(200).json(atm_transaction);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res
      .status(500)
      .json({ error: "Something went wrong while fetching transactions" });
  }
};
module.exports = {
  createAtmTransactions,
  getAllAtmTransaction,
};
