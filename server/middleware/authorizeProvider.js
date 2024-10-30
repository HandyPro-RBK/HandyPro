const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authorizeProvider = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, "your_secret_key");

    const provider = await prisma.serviceProvider.findUnique({
      where: { id: decoded.providerId },
    });

    if (!provider) {
      return res.status(401).json({ error: "Service provider not found" });
    }

    req.provider = provider;

    const isAccessingOwnResource =
      req.params.providerId === provider.id.toString();
    if (!isAccessingOwnResource && req.method !== "GET") {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    console.error("Authorization error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = authorizeProvider;
