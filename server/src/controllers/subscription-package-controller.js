const prisma = require("../utils/prisma-client");

const getAllSubscriptionPackages = async (req, res) => {
  try {
    const subscriptionPackages =
      await prisma.pt_subscription_package_meta.findMany();
    res.status(200).json(subscriptionPackages);
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong while fetching subscription packages",
    });
  }
};

module.exports = { getAllSubscriptionPackages };
