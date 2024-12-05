const prisma = require("../utils/prisma-client");

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.wp_users.findMany();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while fetching users" });
    console.error("Error fetching users:", error);
  }
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;  // Get the user ID from the request parameters

  try {
    const user = await prisma.wp_users.findUnique({
      where: {
        ID: parseInt(id), // Use the ID from the URL (converted to integer)
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong while fetching the user" });
    console.error("Error fetching the user:", error);
  }
};

const addUser = async (req, res) => {
  const { display_name, user_role, user_upline_id, user_level } = req.body;

  try {
    const newUser = await prisma.wp_users.create({
      data: {
        display_name,
        user_role,
        user_upline_id,
        user_level,
        user_login: display_name.toLowerCase().replace(/\s+/g, "_"), // Auto-generate login
        user_pass: "default_password", // Placeholder password, should be updated securely later
        user_registered: new Date(), // Current date as registration time
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error adding new user:", error);
    res.status(500).json({ error: "Failed to add new user" });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,  // Export the new function
  addUser,
};
