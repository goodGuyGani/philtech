const express = require("express");
const { getVouchers } = require("../controllers/getRequest");
const { createVouchers } = require("../query/postRequest");
const { createAtmTransactions } = require("./controllers/atm-transaction-controller");
const { createTvVouchers } = require("./controllers/tv-voucher-controller");
const { getSubscriptionData } = require("./controllers/subscription-meta-controller");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger-output.json");
const transactionRoutes = require("./routes/transaction");
const merchantRoutes = require("./routes/merchant");
const distributorRoutes = require("./routes/distributor");
const wifiVoucherRoutes = require("./routes/wifi-voucher");
const AtmTransactionRoutes = require("./routes/atm-transaction");
const tvVoucherRoutes = require("./routes/tv-voucher");
const gsatVoucherRoutes = require("./routes/gsat-voucher")
const subscriptionPackageRoutes = require("./routes/subscription-package")
const userRoutes = require("./routes/user");
const invitationCodeRoutes = require('./routes/invitation-code');
const subscriptionMetaRoutes = require('./routes/subscription-meta');

const { createGsatVouchers, buyGsatVoucher } = require("./controllers/gsat-voucher-controller");
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


dotenv.config();

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://philtechbetamain.local"],
    methods: ["GET", "POST", "DELETE", "HEAD", "PUT", "PATCH"],
    credentials: true,
  })
);

//api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Users
app.use("/api", userRoutes);

//Transactions

app.use("/api", transactionRoutes);

//GSAT Vouchers
app.use("/api", gsatVoucherRoutes);

//Wifi Vouchers
app.use("/api", wifiVoucherRoutes);

//TV Vouchers
app.use("/api", tvVoucherRoutes);

//ATM transactions
app.use("/api", AtmTransactionRoutes);

//Subscription packages
app.use("/api", subscriptionPackageRoutes)

//Invitation code
app.use('/api', invitationCodeRoutes);

//Subscription meta
app.get('/subscription-meta/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const subscriptionData = await getSubscriptionData(parseInt(id, 10));

    // Handle case where no data is found
    if (!subscriptionData || Object.keys(subscriptionData).length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json(subscriptionData);
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the data' });
  }
});




// app.post("/buy-gsat-vouchers", async (req, res) => {
//   const { user_id, product } = req.body;

//   if (!user_id || !product) {
//     return res.status(400).json({ error: "User ID and product code are required." });
//   }

//   try {
//     const updatedVoucher = await buyGsatVoucher(user_id, product);
//     res.status(200).json({
//       message: "Voucher successfully assigned.",
//       updatedVoucher,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

app.get('/api/invitation-code/:code', async (req, res) => {
  const { code } = req.params;

  try {
    // Check if the invitation code exists
    const invitation = await prisma.wp_ihc_invitation_codes.findFirst({
      where: { code },
    });

    if (!invitation || !invitation.user_id) {
      return res.status(404).json({ error: 'Invitation code not found or invalid' });
    }

    const userLine = await prisma.wp_users.findFirst({
      where: { ID: invitation.user_id },
    })

    // Return the user ID of the code owner
    res.status(200).json({ user_id: invitation.user_id, user_level: userLine.user_level });
  } catch (error) {
    console.error('Error fetching invitation code owner:', error);
    res.status(500).json({ error: 'An error occurred while fetching the invitation code owner' });
  }
});

app.post('/api/register-users', async (req, res) => {
  const { user_login, user_pass, user_email } = req.body;

  function parseUserData(data) {
    return {
      user_login: data.user_login,
      user_pass: data.user_pass,
      user_email: data.user_email,
      display_name: data.display_name || data.user_login,
      user_role: data.user_role || 'subscriber',
      user_level: data.user_level ? parseInt(data.user_level, 10) : 0,
      user_referral_code: data.user_referral_code || null,
      user_referred_by_id: data.user_referred_by_id ? parseInt(data.user_referred_by_id, 10) : null,
      user_upline_id: data.user_referred_by_id ? parseInt(data.user_referred_by_id, 10) : null,
      user_credits: data.user_credits ? parseFloat(data.user_credits) : 0,
      user_nicename: data.user_nicename || data.user_login,
      user_url: data.user_url || '',
      user_registered: data.user_registered ? new Date(data.user_registered) : new Date(),
      user_activation_key: data.user_activation_key || '',
      user_status: data.user_status ? parseInt(data.user_status, 10) : 0,
    };
  }

  // Basic validation
  if (!user_login || !user_pass || !user_email) {
    return res.status(400).json({ error: 'Username, password, and email are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(user_pass, 10);

    // Parse and validate data based on schema
    const userData = parseUserData({
      ...req.body,
      user_pass: hashedPassword,
    });

    // Create a new user in the database
    const newUser = await prisma.wp_users.create({
      data: userData,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while saving the user' });
  }
});

// app.post('/api/register-users', async (req, res) => {
//   const {
//     user_login,
//     user_pass,
//     user_email,
//     display_name,
//     user_role,
//     user_level,
//     user_referral_code,
//     user_referred_by_id,
//     user_credits,
//     ...otherFields
//   } = req.body;

//   console.log(req.body);

//   // Basic validation
//   if (!user_login || !user_pass || !user_email) {
//     return res.status(400).json({ error: 'Username, password, and email are required.' });
//   }

//   try {
//     // Prepare user data
//     const userData = {
//       user_login,
//       user_pass,
//       user_email,
//       display_name: display_name || user_login,
//       user_role: user_role || 'subscriber',
//       user_level: parseInt(user_level) || 0,
//       user_referral_code: user_referral_code || null,
//       user_referred_by_id: user_referred_by_id ? parseInt(user_referred_by_id) : null,
//       user_credits: parseFloat(user_credits) || 0,
//       ...otherFields,
//     };

//     // Save user to the database
//     const newUser = await prisma.wp_users.create({ data: userData });

//     // Sanitize response (handling BigInt for ID)
//     res.status(201).json({ ...newUser, ID: newUser.ID.toString() });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ error: 'An error occurred while saving the user' });
//   }
// });



app.put("/api/buy-gsat-voucher", async (req, res) => {
  const { user_id, product_code, email, stocks } = req.body;

  try {
    const assignedVouchers = await buyGsatVoucher(user_id, product_code, email, stocks);
    res.status(200).json(assignedVouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





app.get("/vouchers", async (req, res) => {
  try {
    const employees = await getVouchers();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Upload employees object
app.post("/uploadvouchers", async (req, res) => {
  const vouchers = req.body;

  if (!Array.isArray(vouchers)) {
    return res.status(400).json({
      error: "Invalid data format. Expected an array of voucher objects.",
    });
  }

  try {
    const result = await createVouchers(vouchers);
    res.status(200).json({
      message: "Voucher data received and processed successfully.",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process voucher data" });
  }
});

app.post("/upload-gsat-vouchers", async (req, res) => {
  const vouchers = req.body;

  if (!Array.isArray(vouchers)) {
    return res.status(400).json({
      error: "Invalid data format. Expected an array of voucher objects.",
    });
  }

  try {
    const result = await createGsatVouchers(vouchers);
    res.status(200).json({
      message: "Voucher data received and processed successfully.",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process voucher data" });
  }
});

app.post("/upload-atm-transaction", async (req, res) => {
  const transaction = req.body;

  if (!Array.isArray(transaction)) {
    return res.status(400).json({
      error: "Invalid data format. Expected an array of voucher objects.",
    });
  }

  try {
    const result = await createAtmTransactions(transaction);
    res.status(200).json({
      message: "Voucher data received and processed successfully.",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process voucher data" });
  }
});

app.post("/upload-tv-voucher", async (req, res) => {
  const voucher = req.body;

  if (!Array.isArray(voucher)) {
    return res.status(400).json({
      error: "Invalid data format. Expected an array of voucher objects.",
    });
  }

  try {
    const result = await createTvVouchers(voucher);
    res.status(200).json({
      message: "Voucher data received and processed successfully.",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process voucher data" });
  }
});



// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
