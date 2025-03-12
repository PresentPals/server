const jwt = require("jsonwebtoken");
require("dotenv").config();

async function validateToken (request, response, next) {

    // Get the token from the header.
    const token = request.headers["authorization"]?.split(" ")[1]; 

    // If no token is provided, sends a 403 error and a message.
    if (!token) {
        return response.status(403).json({ message: "Forbidden access. No security token in place.Please log back into the application for a new security token to be generated."});
    }
try {
    // Verify the token & the secret from .env file
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.authUserData = decoded;
    next();

} catch (error) {
    // If the token has expired or is invalid sends a message.

    return response.status(401).json({ message: "Unauthorised access, your security token has expired !. Please log back into the application."});
}  
}

module.exports = {
    validateToken
};