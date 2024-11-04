const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
    console.error("Error fetching service details:", error);
    res.status(500).json({ error: "Failed to fetch service details" });
  }
};

const createBooking = async (req, res) => {
  try {
    const { userId, serviceId, providerId, bookingDate, notes } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    const serviceExists = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    const providerExists = await prisma.serviceProvider.findUnique({
      where: { id: providerId },
    });

    if (!userExists) {
      return res.status(400).json({ error: "User does not exist" });
    }

    if (!serviceExists) {
      return res.status(400).json({ error: "Service does not exist" });
    }

    if (!providerExists) {
      return res.status(400).json({ error: "Provider does not exist" });
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
        totalPrice: 0, // Placeholder for total price
      },
    });

    res.status(201).json({ message: "Booking Request Sent", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

module.exports = {
  fetchAllServices,
  fetchServiceDetails,
  createBooking,
};
