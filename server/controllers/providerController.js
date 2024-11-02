const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const prisma = new PrismaClient();

// Validation schema for service provider registration
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

// Validation schema for service provider login
const validateProviderLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

// Create a new service provider
const createNewServiceProvider = async (req, res) => {
  try {
    // Validate the request body
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

    // Check if the email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    const existingProvider = await prisma.serviceProvider.findUnique({
      where: { email },
    });
    if (existingUser || existingProvider) {
      return res.status(400).send("Email already in use");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        address,
        phoneNumber,
        photoUrl: photoUrl || "",
        userType: "CUSTOMER", // Set userType as per your requirements
      },
    });

    // Create the service provider
    const newProvider = await prisma.serviceProvider.create({
      data: {
        userId: newUser.id, // Link to the newly created user
        username,
        email,
        password: hashedPassword,
        certification: certification
          ? Buffer.from(certification, "base64")
          : null,
        identityCard: identityCard ? Buffer.from(identityCard, "base64") : null,
        address,
        phoneNumber,
        photoUrl: photoUrl || "",
        age,
        isAvailable: true,
      },
    });

    // Generate a JWT token for authentication
    const token = jwt.sign(
      {
        id: newProvider.id,
        email: newProvider.email,
        userType: "SERVICE_PROVIDER", // You can add userType for differentiating roles
      },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7h" }
    );

    res.status(201).send({ provider: newProvider, token });
  } catch (err) {
    console.error("Error creating service provider:", err);
    res.status(500).send("Server error");
  }
};

// Login a service provider
const loginServiceProvider = async (req, res) => {
  try {
    // Validate the request body
    const { error } = validateProviderLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;

    // Find the service provider by email
    const provider = await prisma.serviceProvider.findUnique({
      where: { email },
    });
    if (!provider) return res.status(400).send("Invalid email or password");

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, provider.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password");
    }

    // Generate a JWT token for authentication
    const token = jwt.sign(
      { id: provider.id, email: provider.email },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7h" }
    );

    res.status(200).send({ token });
  } catch (err) {
    console.error("Error logging in service provider:", err);
    res.status(500).send(err);
  }
};

module.exports = { createNewServiceProvider, loginServiceProvider };
