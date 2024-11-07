const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const conversationRouter = require("./routes/conversations");
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
app.use(cors());
const server = createServer(app);

// Fix 1: Correct CORS configuration for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Remove trailing slash
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Move body-parser configuration before defining routes
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
require("dotenv").config();

// Define routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/conversations", conversationRouter);
app.use("/user", userRouter);
app.use("/service",authorizeProvider, serviceRouter);
app.use("/api/my-categories", myCategoryRoutes);
app.use("/api/my-services", myServiceRoutes);
app.use("/service-provider", serviceProviderRouter); 
app.use("/provider",authorizeProvider, providerRoutes);
app.use("/serviceDetail",authorizeProvider, servicedRoutes);
// app.use("/posts", postDetailRoutes);
app.use("/api/dashboard", dashboardRouter);
const prisma = new PrismaClient();

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinConversation", (conversationId) => {
    // Leave previous rooms if any
    Object.keys(socket.rooms).forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    socket.join(conversationId);
    console.log(`A user joined conversation: ${conversationId}`);
  });

  socket.on("sendMessage", async (message) => {
    try {
      const savedMessage = await prisma.message.create({
        data: {
          conversationId: message.conversationId,
          sender: message.sender,
          content: message.content,
          createdAt: new Date(message.createdAt)
        }
      });
      
      io.to(message.conversationId).emit("newMessage", savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("messageError", { message: "Failed to save message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Fix 2: Use server.listen instead of app.listen
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});