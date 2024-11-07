const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const myCategoryRoutes = require("./routes/myCategoryRoutes");
const myServiceRoutes = require("./routes/myServiceRoutes");
const providerRoutes = require("./routes/bookingprovider");
const servicedRoutes = require("./routes/postDetailRoutes");

const serviceProviderRouter = require("./routes/providerRoutes");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const authorizeProvider = require("./middleware/authorizeProvider");
const app = express();
app.use(cors());

// Move body-parser configuration before defining routes
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
require("dotenv").config();

// Define routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/service",authorizeProvider, serviceRouter);
app.use("/api/my-categories", myCategoryRoutes);
app.use("/api/my-services", myServiceRoutes);
app.use("/service-provider", serviceProviderRouter); 
app.use("/provider",authorizeProvider, providerRoutes);
app.use("/serviceDetail",authorizeProvider, servicedRoutes);
// app.use("/posts", postDetailRoutes);
const prisma = new PrismaClient();

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
