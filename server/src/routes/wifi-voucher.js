const express = require("express");
const router = express.Router();
const { createWifiVouchers, getAllWifiVouchers } = require("../controllers/wifi-voucher-controller");

// Route to create Wi-Fi vouchers
router.post("/upload-wifi-vouchers", async (req, res) => {
  try {
    const vouchers = req.body; // assuming you send the vouchers as an array in the body
    const result = await createWifiVouchers(vouchers);
    res.status(201).json(result); // Respond with the created vouchers
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create vouchers" });
  }
});

// Route to get all Wi-fi vouchers

router.get('/wifi-vouchers', getAllWifiVouchers);

module.exports = router;