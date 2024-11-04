// const express = require("express");
// const cors = require("cors");
// const userRouter = require("./routes/userRoutes");
// const serviceRouter = require("./routes/serviceRoutes");
// const myCategoryRoutes = require("./routes/myCategoryRoutes");
// const myServiceRoutes = require("./routes/myServiceRoutes");

// const serviceProviderRouter = require("./routes/providerRoutes"); // Import the service provider router
// const { PrismaClient } = require("@prisma/client");
// const bodyParser = require("body-parser");

// const app = express();
// app.use(cors());

// // Move body-parser configuration before defining routes
// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
// require("dotenv").config();

// // Define routes
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/user", userRouter);
// app.use("/service", serviceRouter);
// app.use("/api/my-categories", myCategoryRoutes);
// app.use("/api/my-services", myServiceRoutes);
// app.use("/service-provider", serviceProviderRouter); // Add the service provider route

// const prisma = new PrismaClient();

// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const myCategoryRoutes = require("./routes/myCategoryRoutes");
const myServiceRoutes = require("./routes/myServiceRoutes");
const serviceProviderRouter = require("./routes/providerRoutes");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");

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
app.use("/service", serviceRouter);
app.use("/api/my-categories", myCategoryRoutes);
app.use("/api/my-services", myServiceRoutes);
app.use("/service-provider", serviceProviderRouter);

// Initialize Prisma
const prisma = new PrismaClient();

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
