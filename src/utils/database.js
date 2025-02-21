const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
    let databaseUrl = process.env.DATABASE_URL;

    try {
        await mongoose.connect(databaseUrl);
    console.log("Connected to the database !");

    } catch (error) {
        console.error("Error connecting to mongoDB: ", error);
        process.exit(1);
    }
    
}

module.exports = { connectDB };