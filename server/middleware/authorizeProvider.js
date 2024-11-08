
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
        success: false,
        message: "Token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = authorizeProvider;
