const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const serviceProviderRouter = require("./routes/serviceProviderRoutes"); // Import the service provider router
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());

// Move body-parser configuration before defining routes
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
require("dotenv").config();

// Define routes
app.use("/user", userRouter);
app.use("/service-provider", serviceProviderRouter); // Add the service provider route

const prisma = new PrismaClient();

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
