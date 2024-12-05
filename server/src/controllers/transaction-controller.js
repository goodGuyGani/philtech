const prisma = require("../utils/prisma-client");

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction_history.findMany();
    res.status(200).json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while fetching transactions" });
  }
};

const getTransactionById = async (req, res) => {
  const { transactionId } = req.params; // Get the transactionId from the URL parameter

  try {
    const transaction = await prisma.transaction_history.findUnique({
      where: { transactionId: transactionId },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while fetching the transaction" });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
};
