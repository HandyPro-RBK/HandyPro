const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");

const { PrismaClient } = require("@prisma/client");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/user", userRouter);
app.use("/service", serviceRouter);


const prisma = new PrismaClient();

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
