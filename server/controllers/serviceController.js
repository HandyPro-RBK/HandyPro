const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createService = async (req, res) => {
  try {
    console.log(req.body);

    const {
      name,
      description,
      price,
      duration,
      categoryId,
      providerId,
      image,
    } = req.body;
    // Validate required fields
    if (!name || !description || !price || !categoryId || !providerId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create service
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        categoryId: parseInt(categoryId),
        providerId: parseInt(providerId),
        image: image || "",
        isActive: true,
      },
    });
    console.log(service);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    cconsole.error("Error creating service:", error);
    res.status(500).json({ error: "Failed to create service", details: error.message });
  }
};

const getServicesByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const services = await prisma.service.findMany({
      where: {
        providerId: parseInt(providerId),
      },
      include: {
        category: true,
      },
    });
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

module.exports = {
  createService,
  getServicesByProvider,
  getCategories,
};
