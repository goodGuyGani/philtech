const express = require('express');
const { getAllDistributors } = require('../controllers/distributor-controller');

const router = express.Router();

// GET all distributors
router.get('/distributor', getAllDistributors);

module.exports = router;