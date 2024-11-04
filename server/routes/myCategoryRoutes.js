const express = require("express");
const router = express.Router();
const { fetchCategories } = require("../controllers/myCategoryController");

router.get("/", fetchCategories); // Fetch all categories

module.exports = router;
