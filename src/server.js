const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const userRoutes= require("./routes/userRoutes");
const giftListRoutes = require("./routes/giftListRoutes");

const corsoptions = { origin: ["http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5000", "http://127.0.0.1:5000" ]};


const app = express();

app.use(helmet());
app.use(cors(corsoptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/giftlist", giftListRoutes);

module.exports = { app };