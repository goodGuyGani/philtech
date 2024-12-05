const express = require("express");
const { getSubscriptionData } = require("../controllers/subscription-meta-controller");

const router = express.Router();

//Get info about a subscription meta
router.get("/subscription-meta/:subscriptionId", getSubscriptionData);

module.exports = router;