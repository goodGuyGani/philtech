const prisma = require("../utils/prisma-client");

const getSubscriptionData = async (subscriptionId) => {
  // Fetch all records for the given subscription_id
  const data = await prisma.wp_ihc_user_subscriptions_meta.findMany({
    where: {
      subscription_id: subscriptionId,
    },
  });

  // Transform the data into a structured object
  const structuredData = data.reduce((result, item) => {
    result[item.meta_key] = item.meta_value;
    return result;
  }, {});

  // Include subscription_id explicitly
  structuredData.subscription_id = subscriptionId;

  return structuredData;
};

module.exports = { getSubscriptionData };
