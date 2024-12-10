const { PrismaClient } = require("@prisma/client");
const Prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables
const { PasswordHash } = require("phpass"); // Correct import of phpass

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await Prisma.wp_users.findFirst({
      where: { user_email: email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Create a phpass hash instance
    const hasher = new PasswordHash();

    // Verify the password using phpass's checkPassword method
    const isPasswordValid = hasher.checkPassword(password, user.user_pass);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Use environment variable for JWT secret
    const jwtSecret = process.env.JWT_SECRET || "default_secret_key";

    const token = jwt.sign({ id: user.ID }, jwtSecret, { expiresIn: "1d" });

    res.json({
      user: {
        id: user.ID,
        email: user.user_email,
        name: user.display_name,
        role: user.user_role,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "An error occurred during login." });
  }
};

module.exports = { login };
