// Imports dependencies
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// Importing Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes= require("./routes/userRoutes");
const giftListRoutes = require("./routes/giftListRoutes");

// express application instance
const app = express();

// adding middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Sets up Routes to handle requests
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/giftlist", giftListRoutes);

module.exports = { app };