const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const prisma = new PrismaClient();

// Validation schema for user registration
const validateRegistration = (data) => {
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
    address: Joi.string().max(255).required(),
    phoneNumber: Joi.string().max(15).required(),
    photoUrl: Joi.string().max(1024).optional(),
  });
  return schema.validate(data);
};

// Validation schema for user login
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().max(255).required(),
  });
  return schema.validate(data);
};

// Create a new user
const createNewUser = async (req, res) => {
  try {
    // Validate the request body
    const { error } = validateRegistration(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { username, email, password, address, phoneNumber, photoUrl } =
      req.body;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).send("Email already in use");

    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        address,
        phoneNumber,
        photoUrl: photoUrl || "", 
        userType: "CUSTOMER", 
      },
    });

    // Generate a JWT token for authentication
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, userType: newUser.userType },
      "your_secret_key", 
      { expiresIn: "7h" } 
    );

    res.status(201).send({ user: newUser, token });
  } catch (err) {
    if (err.code === "P2002") {
      
      return res.status(400).send("Username already in use");
    }
    console.error("Error creating user:", err);
    res.status(500).send("Server error");
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    // Validate the request body
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).send("Invalid email or password");

    // hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).send("Invalid email or password");

    // Generate a JWT 
    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType },
      "your_secret_key", 
      { expiresIn: "7h" }
    );

    res.status(200).send({ token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send(err);
  }
};

module.exports = { createNewUser, loginUser };
