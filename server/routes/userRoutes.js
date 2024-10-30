const express = require("express");
const router = express.Router();
const authorizeUser = require("../middleware/authorizeUser");
const {
  createNewUser,
  loginUser,
  updateUser,
  getUserProfile,
} = require("../controllers/userController");

// Public routes
router.post("/create", createNewUser);
router.post("/login", loginUser);

// Protected routes
router.put("/update/:userId", authorizeUser, updateUser);


module.exports = router;
