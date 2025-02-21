const { app } = require("./server.js");


require("dotenv").config();

// GET the PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, async() => {
    // Server is running at this point
    await connectDB();

    console.log("Server is running on port: " + PORT);
});
