
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authorizeProvider = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({
        error: "No authorization header found",
        details: "Please provide a Bearer token",
      });
    }

    // Check Bearer token format
    const authHeader = req.headers.authorization;
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Invalid authorization format",
        details: "Token must be Bearer token",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error: "No token provided",
        details: "Token is required",
      });
    }

    try {
      const decoded = jwt.verify(token, "your_secret_key");

      if (!decoded.id || decoded.type !== "SERVICE_PROVIDER") {
        return res.status(401).json({
          error: "Invalid token content",
          details: "Token payload is invalid",
        });
      }

      const provider = await prisma.serviceProvider.findUnique({
        where: { id: decoded.id },
      });

      if (!provider) {
        return res.status(401).json({
          error: "Provider not found",
          details: "The provider associated with this token no longer exists",
        });
      }

      req.provider = provider;
      next();
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Token expired",
          details: "Please login again to get a new token",
        });
      }
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({
          error: "Invalid token",
          details: jwtError.message,
        });
      }
      throw jwtError;
    }
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: "An unexpected error occurred during authorization",
    });
  }
};

module.exports = authorizeProvider;