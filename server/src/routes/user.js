const express = require("express");
const { getAllUsers, addUser, getSingleUser, getPassword } = require("../controllers/user-controller");

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/add-user", addUser);
router.get('/users/:id', getSingleUser);

module.exports = router;
