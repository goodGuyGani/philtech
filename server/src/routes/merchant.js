const express = require('express');
const { getAllMerchants } = require('../controllers/merchant-controller');

const router = express.Router();

// GET all merchants
router.get('/merchant', getAllMerchants);

module.exports = router;