const prisma = require("../utils/prisma-client");

const getAllDistributors = async (req, res) => {
  try {
    const distributors = await prisma.distributor.findMany();
    res.status(200).json(distributors);
  } catch (error) {
    req
      .sendStatus(500)
      .json({ error: "Something went wrong while fetching distributors" });
  }
};

module.exports = { getAllDistributors };
