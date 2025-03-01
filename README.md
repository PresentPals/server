# T3A2 Part B Server

## Auth Middleware
![image_auth_middleware](./src/images/auth_middleware.png)


    const jwt = require("jsonwebtoken");

This line of code imports the jsonwebtoken package which a library used to create, verify and decode JWT JSON Web Tokens. A JWT is a compact URL safe way of representing claims to be transferred between two parties, it is often used in authentication for web applications. When a user logs into the server it creates a JWT that contains the users identity or user ID it then reverts that back to the client. The client then includes a token in the head of future rquests to prove their identity.


    require("dotenv").config();

When you import the dotenv package it calls its config() function to load the environment variables from a .env file into process.env. These environment variables are typically used to store sensitive information like API keys, database credentials or secret keys outside of the codebase. You would usually store the secret key used for signing tokens inside the .env file. This way your sensitive information like JWT_SECRET is not hardcoded into your application which then improves your security.


    async function validateToken (request, response, next) 

This function is defining an Express middleware called validateToken. The Middleware functions are used in express to process requests before they reach the actual route handlers, this particular middleware is used to validate JWT tokens that are including in the requests to ensure the use is authenticated and authorised to access specific routes.

The <b>async</b> keyword is used to make the function asynchronous, meaning it can perform asynchronous operations like verifying a JWT using <b>await</b>. This allows it to perform tasks like reading from the database and/or verifying a token without blocking the main execution flow.

<b>request</b> object contains the details of the HTTP request like headers, body, and query parameters.
<b>response</b> object allows you to send responses back to the client.
<b>next</b> callback function is used to pass control to the next middleware or route handler. If the token is valid <b>next()</b> should be called to pass control to the next middleware or route handler, however if the token is invalid, an erro response is sent and <b>next()</b> is not called.

    // Get the token from the header.
    const token = request.headers.jwt;

This middleware checks if the authorisation header contains a valid token, if the token isn't provided it sends a HTTP status response 403 status code and a message indicating access has been denied because no token has been provided.

    // If no token is provided.
    if (!token) {
        return response.status(403).json({ message: "Forbidden access. No security token in place."});
    }

If a token is provided, the middleware proceeds to verify the token using the <b>jwt.verify()</b> method from the jsonwebtoken library. This method will then decode and validate the JWT against a secret key stored in the environment variable to ensure the token is legitimate and has not been tampered with.  If the token is expired or malformed, jwt.verify() will throw an error and the middleware will respod with a HTTP status code of 400 and a message indicating the token is invalid. If the token is valid then jwt.verify() will return the decoded payload of the user ID and other claims stored inside the token. This payload can be added to the request object so that  subsequent middleware and rout handlers can access it.

    try {
    // Verify the token & the secret from .env file
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.authUserData = decoded;
    next();

    } catch (error) {   

This is part of the JWT verification middleware which is designed to verity the authenticity of a JWT and attach the decoded tokens data to the request object. This allows the rest of the application to acess the user's data in subsequent middleware or route handlers. The <b>jwt.vertify(token,process.env.JWT_SECRET);</b> is using the jsonwebtokens library to verify the JWT. The token is sent by the client (usually) in the authorisation header. The process.env.JWT_SECRET is the secret key that is used to sign the toke, this secret key is store in your .env file which ensures that it is kept safe and not hardcoded in your source code. If the token is valid and signed with the same secret key jwt.verify() will then decode the token and return the payload the user embedded in th token. If the token is invalid then it has either been tampered with, is expired or malformed and the verify() function will trow an error which gets caught in the catch block.

<b>request.authUserData = decoded;</b> is attached to the decoded user data, once the token is successfully verified, the decoded data is added to the request object. This makes the user data available to any subsequent route handlers or middleware.

<b>next()</b> function is called to pass the control to the next middleware or route handler in the request-response cycle. It is important to call next() after the verification process so that the request can continue to the next stage of handling.

<b>catch (error)</b> If an error is detected the jwt.verify() throws an error if the token is invalid or expired, the catch block with catch the error and return

    return response.status(401).json({ message: "Unauthorised access, your security token has expired !"});

If an error occurs the 400 status code is sent back to the client along with the message "Unauthorised access, security token has expired." This informs the client that they need to privide a valid token or reauthenticate if token has expired.

    
    module.exports = {
        validateToken
    };

This will export the validateToken function from the current file so that i can be imported and used in other parts of the application, suc as routes or other middleware. This is essential for maintaining modular architecture in your Node.js application.
