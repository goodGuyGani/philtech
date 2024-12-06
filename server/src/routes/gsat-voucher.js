const express = require("express");
const router = express.Router();
const { getAllGsatVouchers, buyGsatVoucher, getGsatVoucherByUserId } = require("../controllers/gsat-voucher-controller");

router.get("/gsat-vouchers", getAllGsatVouchers);

// Buy a Gsat voucher
router.post("/buy-gsat-vouchers", buyGsatVoucher);
router.get('/gsat-voucher-by-user-id/:user_id', getGsatVoucherByUserId);

module.exports = router;