const { User } = require("../models/UserModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function signupUser(request, response) {
    // Importing the signup details from the request body
    const { accountEmail, firstname, lastname, password } = request.body;

    // Checking to see if the email exists
    const existingEmail = await User.findOne({ accountEmail });

    // If the email exists, send an error message
    if (existingEmail) {
        return response
        .status(400)
        .json({
            "message": "This email is already in use. Please re-enter another email!"
        });
    }

    // Use bcrypt to hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt value

    // Create the user using the User model
    const user = await User.create({
        accountEmail,
        firstname,
        lastname,
        password: hashedPassword 
    });

    // Send a response acknowledgement message that user has signed up
    response
    .status(201)
    .json({
        "message": `User ${firstname}, ${lastname} with email: ${accountEmail}, has successfully signed up!`
    });
}

async function loginUser(request, response) {
    // Importing the email and password from the request body
    const { accountEmail, password } = request.body;

    // Check if the user is in the database
    const user = await User.findOne({ accountEmail });

    // If the user does not exist, send an error message
    if (!user){
        return response
        .status(400)
        .json({
            "message": "Invalid email. Email does not exist. Please go to the signup page."
        });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return response
        .status(400)
        .json({
            "message": "Invalid password. Please try again !"
        });
    }

    const token = jwt.sign(
        {accountEmail: accountEmail},
        process.env.JWT_SECRET,
        { expiresIn: "1h"}
    );

    response.status(200).json(
        { token }
    );
}

module.exports = {
    signupUser,
    loginUser
};
