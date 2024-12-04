const express = require("express");
const router = express.Router();
const {
  fetchAllServices,
  fetchServiceDetails,
  createBooking,
  fetchServiceReviews,
  createReview,
} = require("../controllers/myServiceController");
const authorizeUser = require("../middleware/authorizeUser");

// Public routes
router.get("/", fetchAllServices);
router.get("/:id", fetchServiceDetails);
router.get("/:id/reviews", fetchServiceReviews);

// Protected routes
router.post("/bookings", authorizeUser, createBooking);
router.post("/reviews", authorizeUser, createReview);

module.exports = router;
