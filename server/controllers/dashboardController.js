const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

module.exports = {
  getUserBookings,
};
