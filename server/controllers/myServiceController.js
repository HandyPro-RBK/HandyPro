const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fetchAllServices = async (req, res) => {
  try {
    const { categoryId, city, providerId } = req.query;

    let whereClause = {
      provider: {
        isActive: true,
      },
    };

    if (categoryId) {
      whereClause.categoryId = parseInt(categoryId);
    }

    if (city) {
      whereClause.provider.city = city;
    }

    if (providerId) {
      whereClause.providerId = parseInt(providerId);
    }

    const services = await prisma.service.findMany({
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            username: true,
            email: true,
            photoUrl: true,
            rating: true,
            isAvailable: true,
            city: true,
          },
        },
      },
    });

    if (!services) {
      return res.status(404).json({ message: "No services found" });
    }

    res.json(services);
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({
      error: "Failed to fetch services",
      details: error.message,
    });
  }
};

const fetchServiceDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            username: true,
            email: true,
            photoUrl: true,
            rating: true,
            isAvailable: true,
            city: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                photoUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        bookings: {
          where: {
            status: "CONFIRMED",
          },
          select: {
            id: true,
            bookingDate: true,
            status: true,
          },
          orderBy: {
            bookingDate: "asc",
          },
          take: 5,
        },
      },
    });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    const averageRating =
      service.reviews.length > 0
        ? service.reviews.reduce((acc, review) => acc + review.rating, 0) /
          service.reviews.length
        : 0;

    const serviceWithRating = {
      ...service,
      averageRating: parseFloat(averageRating.toFixed(1)),
    };

    res.json(serviceWithRating);
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({
      error: "Failed to fetch service details",
      details: error.message,
    });
  }
};

const createBooking = async (req, res) => {
  try {
    const { serviceId, providerId, bookingDate, notes } = req.body;
    const userId = req.user.id;

    const serviceExists = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        provider: true,
      },
    });

    if (!serviceExists) {
      return res.status(400).json({ error: "Service does not exist" });
    }

    if (
      !serviceExists.provider.isActive ||
      !serviceExists.provider.isAvailable
    ) {
      return res
        .status(400)
        .json({ error: "Service provider is not available" });
    }

    const existingBookings = await prisma.booking.findMany({
      where: {
        providerId,
        bookingDate: bookingDate,
        status: { not: "CANCELLED" },
      },
    });

    if (existingBookings.length > 0) {
      return res
        .status(400)
        .json({ error: "The requested date and time are not available" });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        providerId,
        bookingDate,
        notes: notes || null,
        status: "PENDING",
        totalPrice: serviceExists.price || 0,
      },
      include: {
        service: true,
        provider: true,
      },
    });

    res.status(201).json({
      message: "Booking Request Sent",
      booking,
    });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({
      error: "Failed to create booking",
      details: error.message,
    });
  }
};

module.exports = {
  fetchAllServices,
  fetchServiceDetails,
  createBooking,
};
