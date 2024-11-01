const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const prisma = new PrismaClient();

const validateProviderRegistration = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(4).max(50).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(10).max(255).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
      }),
    certification: Joi.string().optional(),
    identityCard: Joi.string().optional(),
    address: Joi.string().max(255).required(),
    phoneNumber: Joi.string().max(15).required(),
    photoUrl: Joi.string().max(1024).optional(),
    age: Joi.string().optional(),
  });
  return schema.validate(data);
};

const validateProviderLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

const createNewServiceProvider = async (req, res) => {
  try {
    const { error } = validateProviderRegistration(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {
      username,
      email,
      password,
      certification,
      identityCard,
      address,
      phoneNumber,
      photoUrl,
      age,
    } = req.body;

    // Check for existing provider
    const existingProvider = await prisma.serviceProvider.findUnique({
      where: { email },
    });

    if (existingProvider) {
      return res.status(400).send("Email already in use");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new provider
    const newProvider = await prisma.serviceProvider.create({
      data: {
        username,
        email,
        password: hashedPassword,
        certification: certification
          ? Buffer.from(certification, "base64")
          : null,
        identityCard: identityCard ? Buffer.from(identityCard, "base64") : null,
        address,
        phoneNumber,
        photoUrl: photoUrl || null,
        age,
        isAvailable: true,
        rating: 0.0,
      },
    });

    const token = jwt.sign(
      {
        id: newProvider.id,
        email: newProvider.email,
        type: "SERVICE_PROVIDER",
      },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7h" }
    );

    // Remove  data before sending response
    const providerResponse = {
      ...newProvider,
      password: undefined,
      certification: undefined,
      identityCard: undefined,
    };

    res.status(201).send({
      provider: providerResponse,
      token,
    });
  } catch (err) {
    console.error("Error creating service provider:", err);
    res.status(500).send("Server error");
  }
};

const loginServiceProvider = async (req, res) => {
  try {
    const { error } = validateProviderLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;

    const provider = await prisma.serviceProvider.findUnique({
      where: { email },
    });

    if (!provider) {
      return res.status(400).send("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, provider.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password");
    }

    // Generate  token
    const token = jwt.sign(
      {
        id: provider.id,
        email: provider.email,
        type: "SERVICE_PROVIDER",
      },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7h" }
    );

    // Remove  data before sending response
    const providerResponse = {
      ...provider,
      password: undefined,
      certification: undefined,
      identityCard: undefined,
    };

    res.status(200).send({
      provider: providerResponse,
      token,
    });
  } catch (err) {
    console.error("Error logging in service provider:", err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  createNewServiceProvider,
  loginServiceProvider,
};
// this file its clear
