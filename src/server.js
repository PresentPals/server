const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const userRoutes= require("./routes/userRoutes");
const giftListRoutes = require("./routes/giftListRoutes");


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/giftlist", giftListRoutes);

module.exports = { app };