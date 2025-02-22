const jwt = require("jsonwebtoken");
require("dotenv").config();

async function validateToken (request, response, next) {

    // Get the token from the header.
    const token = request.headers.jwt;

    // Verify the token & the secret from .env file
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.authUserData = decoded;
    next();
}

module.exports = {
    validateToken
};