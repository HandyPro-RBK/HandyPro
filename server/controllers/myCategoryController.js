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

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const category = await prisma.category.create({
      data: { name, description },
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

module.exports = {
  fetchCategories,
  createCategory,
};
