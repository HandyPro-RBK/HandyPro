const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authorizeUser = async (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    // Log the incoming token for debugging
    console.log("Authorization Header:", req.headers.authorization);

    // Check if token is provided
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    let decoded;
    try {
      // Verify the token
      decoded = jwt.verify(token, "your_secret_key"); // Replace with your actual secret key
    } catch (jwtError) {
      // Handle token errors
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Token has expired",
          code: "TOKEN_EXPIRED",
        });
      }
      return res.status(401).json({
        error: "Invalid token",
        code: "INVALID_TOKEN",
      });
    }

    // Fetch user from the database using the decoded token ID
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    // Log the user fetched for debugging
    console.log("Fetched User:", user);

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        error: "User  not found",
        code: "USER_NOT_FOUND",
      });
    }

    // Attach user object to the request for further use
    req.user = user;

    // Check user type and permissions
    if (user.userType === "ADMIN") {
      return next(); // Admin can access all routes
    }

    // Allow access to dashboard summary for all authenticated users
    if (req.path.includes("/dashboard/summary")) {
      return next();
    }

    // Allow access to bookings for all users
    if (req.path.includes("/bookings")) {
      return next();
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    });
  }
};

module.exports = authorizeUser;
