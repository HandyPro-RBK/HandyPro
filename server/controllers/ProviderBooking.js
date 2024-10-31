const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const getrequests = async (req, res) => {
  try {
    const providerId = parseInt(req.params.providerId);
    const bookingspending = await prisma.booking.findMany({
      where: {
        status: "PENDING",
        providerId: providerId,
      },
      include: {
        user: true,
        service: true,
      },
    });
    const bookingsaccepted = await prisma.booking.findMany({
      where: {
        status: "CONFIRMED",
        providerId: providerId,
      },
      include: {
        user: true,
        service: true,
      },
    });

    res.status(200).send({ bookingspending, bookingsaccepted });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send(err);
  }
};

module.exports = { getrequests, reject, accept };