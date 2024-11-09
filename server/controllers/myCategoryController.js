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

// Fetch all available cities with active service providers
const fetchAvailableCities = async (req, res) => {
  try {
    const providers = await prisma.serviceProvider.findMany({
      select: {
        city: true,
      },
      distinct: ["city"],
      where: {
        isActive: true,
      },
    });

    const cities = providers.map((provider) => provider.city);
    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};

// Fetch providers by category and city
const fetchProvidersByFilters = async (req, res) => {
  try {
    const { categoryId, city } = req.query;

    const providers = await prisma.serviceProvider.findMany({
      where: {
        city: city,
        isActive: true,
        services: {
          some: {
            categoryId: categoryId ? parseInt(categoryId) : undefined,
          },
        },
      },
      include: {
        services: {
          where: {
            categoryId: categoryId ? parseInt(categoryId) : undefined,
          },
          include: {
            category: true,
          },
        },
      },
    });

    res.json(providers);
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ error: "Failed to fetch providers" });
  }
};

module.exports = {
  fetchCategories,
  fetchAvailableCities,
  fetchProvidersByFilters,
};
