const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authorizeUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send("Unauthorized");

    const decoded = jwt.verify(token, "your_secret_key");

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).send("Unauthorized");

    if (user.userType === "ADMIN" || user.id === req.body.id) {
      req.user = user;
      next();
    } else {
      if (req.url === "/update" && user.id !== req.body.id) {
        return res.status(403).send("Forbidden");
      }
      req.user = user;
      next();
    }
  } catch (err) {
    console.error("Error in authorization middleware:", err);
    res.status(401).send("Unauthorized");
  }
};

module.exports = authorizeUser;
