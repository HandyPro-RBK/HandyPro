const express = require("express");
const router = express.Router();
const {
  fetchAllServices,
  updateService,
  fetchServiceDetails,
} = require("../controllers/myServiceController");

router.get("/", fetchAllServices); // Fetch all services
router.get("/:id", fetchServiceDetails); // Fetch service details by ID
router.put("/:id", updateService); // Update a service by ID

module.exports = router;
