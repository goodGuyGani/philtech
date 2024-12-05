const express = require('express');
const { getAllSubscriptionPackages } = require('../controllers/subscription-package-controller');

const router = express.Router();

//Get all subscription packages
router.get('/subscription-package', getAllSubscriptionPackages);

module.exports = router;