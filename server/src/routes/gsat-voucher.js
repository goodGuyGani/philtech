const express = require("express");
const router = express.Router();
const { getAllGsatVouchers, buyGsatVoucher } = require("../controllers/gsat-voucher-controller");

router.get("/gsat-vouchers", getAllGsatVouchers);

// Buy a Gsat voucher
router.post("/buy-gsat-vouchers", buyGsatVoucher);

module.exports = router;