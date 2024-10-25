const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const { PrismaClient } = require("@prisma/client");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);

const prisma = new PrismaClient();

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
