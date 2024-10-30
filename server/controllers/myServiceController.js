const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fetch all services with categories included
const fetchAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: { category: true },
    });
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

// Update a service by ID
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      duration,
      categoryId,
      providerId,
      image,
    } = req.body;

    const updatedService = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        categoryId: parseInt(categoryId),
        providerId: parseInt(providerId),
        image,
      },
    });

    res.json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: "Failed to update service" });
  }
};

module.exports = {
  fetchAllServices,
  updateService,
};
