const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authorizeUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, "your_secret_key");

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;

    if (user.userType === "ADMIN") {
      return next();
    }

    const isAccessingOwnResource = req.params.userId === user.id.toString();
    if (!isAccessingOwnResource) {
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

module.exports = authorizeUser;
