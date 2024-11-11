// myCategoryController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Modified fetchCategories to include top-rated service for each category
const fetchCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        services: {
          distinct: ["name"],
          include: {
            provider: {
              select: {
                id: true,
                username: true,
                email: true,
                photoUrl: true,
                rating: true,
                city: true,
              },
            },
          },
          orderBy: {
            provider: {
              rating: "desc",
            },
          },
        },
      },
    });

    // Process the data to keep only the top-rated provider's service for each unique service name
    const processedCategories = categories.map((category) => ({
      ...category,
      services: Object.values(
        category.services.reduce((acc, service) => {
          if (
            !acc[service.name] ||
            (service.provider.rating || 0) >
              (acc[service.name].provider.rating || 0)
          ) {
            acc[service.name] = service;
          }
          return acc;
        }, {})
      ),
    }));

    res.json(processedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Modified fetchProvidersByFilters to show only top-rated provider per service
const fetchProvidersByFilters = async (req, res) => {
  try {
    const { categoryId, city } = req.query;

    const services = await prisma.service.findMany({
      where: {
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        provider: {
          city: city || undefined,
          isActive: true,
        },
      },
      include: {
        provider: {
          select: {
            id: true,
            username: true,
            email: true,
            photoUrl: true,
            rating: true,
            city: true,
          },
        },
        category: true,
      },
      orderBy: {
        provider: {
          rating: "desc",
        },
      },
    });

    // Group services by name and keep only the top-rated provider's service
    const uniqueServices = Object.values(
      services.reduce((acc, service) => {
        if (
          !acc[service.name] ||
          (service.provider.rating || 0) >
            (acc[service.name].provider.rating || 0)
        ) {
          acc[service.name] = service;
        }
        return acc;
      }, {})
    );

    res.json(uniqueServices);
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ error: "Failed to fetch providers" });
  }
};

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

module.exports = {
  fetchCategories,
  fetchAvailableCities,
  fetchProvidersByFilters,
};
