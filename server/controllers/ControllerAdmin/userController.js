const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.getAllUsers = async (req, res) => {
  let { role } = req.params;
  console.log(role);

  let users = [];
  try {
    if (role === "customer") {
      users = await prisma.user.findMany({
        where: {
          userType: "CUSTOMER",
        },
        select: {
          id: true,
          username: true,
          email: true,
          userType: true,
          address: true,
          phoneNumber: true,
          photoUrl: true,
          createdAt: true,
          isBanned: true,
        },
      });
    } else if (role === "provider") {
      users = await prisma.serviceProvider.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          isAvailable: true,
          city: true,
          phoneNumber: true,
          photoUrl: true,
          rating: true,
          isBanned: true,
          identityCard: true,
          certification: true,
          rating: true,
        },
      });
    }

    res.json(users);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ error: "Error fetching users" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user);

    if (!user || user.userType !== "ADMIN") {
      return res
        .status(401)
        .json({ error: "Invalid credentials or not an admin" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "15h" }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, role: user.userType },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: "Error during login" });
  }
};

exports.adminSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        userType: "ADMIN", // Set role as admin
        address: "123 Main St",
        phoneNumber: "1234567890",
        photoUrl: "https://example.com/photo.jpg",
      },
    });
    console.log(newUser);

    // Save user to database
    // await newUser.save();

    // Create and assign a token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Admin user created successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating admin user", error: error.message });
  }
};
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid refresh token" });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  const idInt = parseInt(id);
  console.log(idInt);
  try {
    await prisma.service.deleteMany({
      where: { categoryId: idInt },
    });
    const category = await prisma.category.delete({
      where: {
        id: idInt,
      },
    });
    res.status(200).json({
      message: "Category with name " + category.name + " deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Error deleting category" });
  }
};
exports.createCategory = async (req, res) => {
  const { name, image, description } = req.body;
  try {
    const category = await prisma.category.create({
      data: {
        name,
        image,
        description,
      },
    });
    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Error creating category" });
  }
};

// update Category by Id
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, image, description } = req.body;
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        image,
        description,
      },
    });
    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Error updating category" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;
  try {
    if (type === "customer") {
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });
    } else if (type === "provider") {
      await prisma.serviceProvider.delete({
        where: { id: parseInt(id) },
      });
    }
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Error deleting user" });
  }
};

exports.banUser = async (req, res) => {
  const { isBanned } = req.body;
  const { id } = req.params;
  const { type } = req.query;
  try {
    if (type === "customer") {
      await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          isBanned: isBanned,
        },
      });
    } else if (type === "provider") {
      await prisma.serviceProvider.update({
        where: { id: parseInt(id) },
        data: {
          isBanned: isBanned,
        },
      });
    }
    res.status(200).json({
      message: "User banned successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Error banning user" });
  }
};
exports.validProvider = async (req, res) => {
  const { isAvailable } = req.body;
  const { id } = req.params;
  try {
    await prisma.serviceProvider.update({
      where: { id: parseInt(id) },
      data: {
        isAvailable: isAvailable,
      },
    });
    res.status(200).json({
      message: "Provider validated successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Error validating provider" });
  }
};
// Add other user-related controller functions here
