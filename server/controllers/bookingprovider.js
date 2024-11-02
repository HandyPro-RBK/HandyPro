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
    console.log(err);
    
    console.error("Error logging in:", err);
    res.status(500).send(err);
  }
};
const getHistory = async (req, res) => {
  const providerId = parseInt(req.params.providerId);
  console.log(providerId);

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        providerId: providerId,
        status: {
          in: ["CONFIRMED", "CANCELLED", "REJECTED", "COMPLETED"],
        },
      },
      include: {
        user: true,
        service: true,
      },
    });

    res.status(200).send(bookings);
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send(err);
  }
};
const accept = async (req, res) => {
  let { requestId, ProviderId } = req.body;
  try {
    const updatedBooking = await prisma.booking.update({
      where: {
        id: requestId,
        providerId: ProviderId,
      },
      data: {
        status: "CONFIRMED",
      },
    });

    res.status(200).send(updatedBooking);
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send(err);
  }
};
const reject = async (req, res) => {
  let { requestId, ProviderId } = req.body;
  try {
    const updatedBooking = await prisma.booking.update({
      where: {
        id: requestId,
        providerId: ProviderId,
      },
      data: {
        status: "REJECTED",
      },
    });

    res.status(200).send(updatedBooking);
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send(err);
  }
};

module.exports = { getrequests, getHistory, reject, accept };
