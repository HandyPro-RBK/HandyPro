const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const myCategoryRoutes = require("./routes/myCategoryRoutes");
const myServiceRoutes = require("./routes/myServiceRoutes");
const providerRoutes = require("./routes/bookingprovider");
const dashboardRouter = require("./routes/dashboardRoutes");
const servicedRoutes = require("./routes/postDetailRoutes");

const serviceProviderRouter = require("./routes/providerRoutes");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const authorizeProvider = require("./middleware/authorizeProvider");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Environment variables
require("dotenv").config();

// Routes
app.use("/user", userRouter);
app.use("/service", authorizeProvider, serviceRouter);
app.use("/api/my-categories", myCategoryRoutes);
app.use("/api/my-services", myServiceRoutes);
app.use("/service-provider", serviceProviderRouter);
app.use("/provider", authorizeProvider, providerRoutes);
app.use("/serviceDetail", authorizeProvider, servicedRoutes);
// app.use("/posts", postDetailRoutes);
app.use("/api/dashboard", dashboardRouter);
const prisma = new PrismaClient();

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
