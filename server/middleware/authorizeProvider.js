const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Authorize service provider middleware
const authorizeProvider = async (req, res, next) => {
  try {
    // Verify the JWT token
    const token = req.headers.authorization;
    if (!token) return res.status(401).send("Unauthorized");

    const decoded = jwt.verify(token, "your_secret_key");

    // Find the service provider in the database
    const provider = await prisma.serviceProvider.findUnique({
      where: { id: decoded.id },
    });
    if (!provider) return res.status(401).send("Unauthorized");

    // Check if the provider is trying to access their own information
    if (provider.id === req.body.id || req.method === "GET") {
      req.provider = provider;
      next();
    } else {
      return res.status(403).send("Forbidden");
    }
  } catch (err) {
    console.error("Error in authorization middleware:", err);
    res.status(401).send("Unauthorized");
  }
};

module.exports = authorizeProvider;
