const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fetch all categories
const fetchCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

module.exports = {
  fetchCategories,
};
