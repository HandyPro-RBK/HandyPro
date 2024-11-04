const express = require("express");
const router = express.Router();
const {
  fetchAllServices,
  fetchServiceDetails,
} = require("../controllers/myServiceController");

router.get("/", fetchAllServices); // Fetch all services
router.get("/:id", fetchServiceDetails); // Fetch service details by ID

module.exports = router;
