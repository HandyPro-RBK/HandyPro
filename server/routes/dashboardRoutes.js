const express = require("express");
const router = express.Router();
const authorizeUser = require("../middleware/authorizeUser");
const {
  getUserBookings,
  getBookingDetails,
  getUserNotifications,
  markNotificationAsRead,
  getUnreadNotificationsCount,
  getDashboardSummary,
} = require("../controllers/dashboardController");

// Dashboard summary
router.get("/summary", authorizeUser, getDashboardSummary);

// Existing routes
router.get("/bookings", authorizeUser, getUserBookings);
router.get("/bookings/:bookingId", authorizeUser, getBookingDetails);
router.get("/notifications", authorizeUser, getUserNotifications);
router.patch(
  "/notifications/:notificationId/read",
  authorizeUser,
  markNotificationAsRead
);
router.get(
  "/notifications/unread-count",
  authorizeUser,
  getUnreadNotificationsCount
);

module.exports = router;
