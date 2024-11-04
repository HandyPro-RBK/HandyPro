const express = require("express");
const router = express.Router();
const {
  fetchAllServices,
  fetchServiceDetails,
  createBooking,
} = require("../controllers/myServiceController");

// Routes for services
router.get("/", fetchAllServices); // Fetch all services
router.get("/:id", fetchServiceDetails); // Fetch service details by ID

// Route for creating a booking
router.post("/bookings", createBooking); // Create a new booking

module.exports = router;
