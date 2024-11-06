const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Update getUserBookings to include payment information
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
            description: true,
            image: true,
            duration: true,
          },
        },
        provider: {
          select: {
            username: true,
            photoUrl: true,
            phoneNumber: true,
            rating: true,
          },
        },
        payments: {
          select: {
            amount: true,
            status: true,
            paymentMethod: true,
          },
        },
      },
      orderBy: {
        bookingDate: "desc",
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(bookingId),
        userId: userId,
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
        provider: {
          select: {
            username: true,
            email: true,
            phoneNumber: true,
            photoUrl: true,
            rating: true,
            address: true,
          },
        },
        payments: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Failed to fetch booking details" });
  }
};

module.exports = {
  getUserBookings,
  getBookingDetails,
};
