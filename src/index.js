const { app } = require("./server.js");
const { connectDB } = require("./utils/database");


require("dotenv").config();

// GET the PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, async() => {
    // Server is running at this point
    await connectDB();

    console.log("Server is running on port: " + PORT);
});
