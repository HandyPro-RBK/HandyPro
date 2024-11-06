const express = require("express");
const router = express.Router();
const authorizeUser = require("../middleware/authorizeUser");
const { getUserBookings } = require("../controllers/dashboardController");

router.get("/bookings", authorizeUser, getUserBookings);

module.exports = router;
