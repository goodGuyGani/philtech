const express = require('express');
const { getAllTransactions, getTransactionById } = require('../controllers/transaction-controller');

const router = express.Router();

// GET all transactions
router.get('/transaction', getAllTransactions);

router.get('/transaction/:transactionId', getTransactionById);

module.exports = router;
