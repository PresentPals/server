// Import mongoose for MongoDB
const mongoose = require("mongoose");
require("dotenv").config();

// Get the database URL from the environment file
async function connectDB() {
  let databaseUrl = process.env.DATABASE_URL;

  // Try to connect to MongoDB using the URL from .env file
  try {
    await mongoose.connect(databaseUrl);
    // Log to the console successful connection
    console.log("Connected to the database !");
    // If connection fails, log error and exit process with failure code
  } catch (error) {
    console.error("Error connecting to mongoDB: ", error);
    process.exit(1);
  }
}

module.exports = { connectDB };
