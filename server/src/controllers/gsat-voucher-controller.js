const prisma = require("../utils/prisma-client");
const nodemailer = require("nodemailer");
require("dotenv").config();

const createGsatVouchers = async (vouchers) => {
  try {
    // Create vouchers in the database
    const result = await prisma.pt_gsat_voucher.createMany({
      data: vouchers,
    });

    return result;
  } catch (error) {
    console.error("Error creating vouchers:", error);
    throw new Error("Failed to create vouchers");
  }
};

const getAllGsatVouchers = async (req, res) => {
  try {
    const gsat_voucher = await prisma.pt_gsat_voucher.findMany();
    res.status(200).json(gsat_voucher);
  } catch (error) {
    req
      .sendStatus(500)
      .json({ error: "Something went wrong while fetching wifi voucher" });
  }
};

const getGsatVoucherByUserId = async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const userVouchers = await prisma.pt_gsat_voucher.findMany({
      where: {
        owned_by: parseInt(user_id),
      },
    });

    res.status(200).json(userVouchers);
  } catch (error) {
    console.error("Error fetching vouchers by user ID:", error);
    res.status(500).json({ error: "Failed to fetch vouchers for the specified user" });
  }
};


const sendEmail = async (toEmail, emailBody) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: {
      name: "PhilTech Inc.",
      address: process.env.GMAIL_USER,
    },
    to: toEmail,
    subject: "GSAT Voucher Assigned",
    text: emailBody, // Plain-text fallback
    html: emailBody, // HTML version
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email to ${toEmail}`);
  }
};

const buyGsatVoucher = async (user_id, product_code, email, stocks) => {
  try {
    // Fetch available vouchers
    const vouchers = await prisma.pt_gsat_voucher.findMany({
      where: {
        product_code,
        owned_by: null, // Only unassigned vouchers
      },
      take: stocks,
    });

    console.log(user_id, product_code, email, stocks)

    if (vouchers.length < stocks) {
      throw new Error(
        `Only ${vouchers.length} vouchers are available. Requested: ${stocks}`
      );
    }

    // Assign vouchers and send individual emails
    const assignedVouchers = [];

    for (const voucher of vouchers) {
      const updatedVoucher = await prisma.pt_gsat_voucher.update({
        where: { gsat_voucher_id: voucher.gsat_voucher_id },
        data: {
          owned_by: parseInt(user_id),
          used_date: new Date(),
        },
      });

      // Construct email body for the individual voucher
      const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 20px;
    }
    .email-container {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      color: #4caf50;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
    }
    .voucher-details {
      margin-bottom: 20px;
    }
    .voucher-details h2 {
      margin: 0 0 10px;
      color: #555;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
    }
    .details-table th,
    .details-table td {
      text-align: left;
      padding: 8px 12px;
      border: 1px solid #ddd;
    }
    .details-table th {
      background-color: #4caf50;
      color: #fff;
    }
    .footer {
      text-align: center;
      font-size: 0.9em;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>🎉 Congratulations!</h1>
      <p>Your GSAT Voucher is Assigned!</p>
    </div>
    <div class="voucher-details">
      <h2>Voucher Details:</h2>
      <table class="details-table">
        <tr>
          <th>Product Code</th>
          <td>${voucher.product_code}</td>
        </tr>
        <tr>
          <th>Serial Number</th>
          <td>${voucher.serial_number}</td>
        </tr>
        <tr>
          <th>Reference Number</th>
          <td>${voucher.reference_number}</td>
        </tr>
        <tr>
          <th>Amount</th>
          <td>₱${voucher.amount}</td>
        </tr>
        <tr>
          <th>Discount</th>
          <td>₱${voucher.discount}</td>
        </tr>
        <tr>
          <th>Expiry Date</th>
          <td>${voucher.expiry_date || "N/A"}</td>
        </tr>
      </table>
    </div>
    <div class="footer">
      <p>If you have any questions, please contact us at support@example.com.</p>
      <p>Thank you for choosing our service!</p>
    </div>
  </div>
</body>
</html>
`;

      // Send email for the individual voucher
      await sendEmail(email, emailBody.trim());

      // Add the updated voucher to the list
      assignedVouchers.push(updatedVoucher);
    }

    return assignedVouchers;
  } catch (error) {
    console.error("Error assigning vouchers or sending emails:", error);
    throw new Error("Failed to complete voucher assignment operation");
  }
};

module.exports = { createGsatVouchers, getAllGsatVouchers, buyGsatVoucher, getGsatVoucherByUserId };
