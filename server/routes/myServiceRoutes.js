const express = require("express");
const router = express.Router();
const {
  fetchAllServices,
  updateService,
} = require("../controllers/myServiceController");

router.get("/", fetchAllServices); // Fetch all services
router.put("/:id", updateService); // Update a service by ID

module.exports = router;
