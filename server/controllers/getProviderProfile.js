// controllers/getProviderProfile.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getProviderProfile = async (req, res) => {
  const { providerId } = req.params;

  try {
    const provider = await prisma.serviceProvider.findUnique({
      where: { id: Number(providerId) },
    });

    if (!provider) {
      return res.status(404).send("Provider not found");
    }

    // Remove sensitive data before sending response
    const providerResponse = {
      ...provider,
      password: undefined,
      certification: undefined,
      identityCard: undefined,
    };

    res.status(200).send(providerResponse);
  } catch (err) {
    console.log(err);
    
    console.error("Error retrieving provider profile:", err);
    res.status(500).send("Server error");
  }
};

const updateProviderProfile = async (req, res) => {
  const { providerId } = req.params;
  const updates = req.body;

  try {
    // Optionally validate the updates here

    const updatedProvider = await prisma.serviceProvider.update({
      where: { id: Number(providerId) },
      data: updates,
    });

    // Remove sensitive data before sending response
    const providerResponse = {
      ...updatedProvider,
      password: undefined,
      certification: undefined,
      identityCard: undefined,
    };

    res.status(200).send(providerResponse);
  } catch (err) {
    console.error("Error updating provider profile:", err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getProviderProfile,
  updateProviderProfile,
};
