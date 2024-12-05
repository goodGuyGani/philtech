const express = require("express");
const {
    createAtmTransactions,
    getAllAtmTransaction,
} = require("../controllers/atm-transaction-controller");

const router = express.Router();

//Create groups of transactions
router.post("/upload-atm-transaction", createAtmTransactions);

//Get all transactions
router.get("/get-atm-transaction", getAllAtmTransaction);

module.exports = router;
