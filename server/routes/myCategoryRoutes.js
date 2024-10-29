const express = require("express");
const router = express.Router();
const {
  fetchCategories,
  createCategory,
} = require("../controllers/myCategoryController");

router.get("/", fetchCategories); // Fetch all categories
router.post("/create", createCategory); // Create a new category

module.exports = router;
