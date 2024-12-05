const express = require("express");
const router = express.Router();
const { createTvVouchers, getAllTvVouchers } = require("../controllers/tv-voucher-controller");

router.post("/upload-tv-vouchers", createTvVouchers);

router.get("/tv-vouchers", getAllTvVouchers);

module.exports = router;
