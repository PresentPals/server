const { User } = require("../models/UserModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function signupUser(request, response) {
    // Importing the signup details from the request body
    const { accountEmail, userName, firstname, lastname, password } = request.body;

    // Check if accountEmail already exists
    const existingEmail = await User.findOne({ accountEmail });
    if (existingEmail) {
        return response.status(400).json({ message: "This email is already in use. Please use another email!" });
    }

    // Check if username already exists
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
        return response.status(400).json({ message: "This username is already in use. Please use another username!" });
    }

    // Use bcrypt to hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt value

    // Create the user using the User model
    const user = await User.create({
        accountEmail,
        userName,
        firstname,
        lastname,
        password: hashedPassword 
    });

    // Send a response acknowledgement message that user has signed up
    response
    .status(201)
    .json({
        "message": `Your ${userName} with ${firstname}, ${lastname} and email: ${accountEmail}, has successfully signed up!`
    });
}

async function loginUser(request, response) {
    // Importing the email and password from the request body
    const { userName, password } = request.body;

    // Check if the user is in the database
    const user = await User.findOne({ userName });

    // If the user does not exist, send an error message
    if (!user){
        return response
        .status(400)
        .json({
            "message": "Invalid username. That username does not exist. Please speak to your parent account holder.."
        });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return response
        .status(401)
        .json({
            "message": "Incorrect password. Please try again !"
        });
    }
    const accountEmail = user.accountEmail;
    const admin = user.admin;
    const child = user.child;
    const childId = user._id;

    const token = jwt.sign(
        {accountEmail: accountEmail, admin: admin, child: child, childId: childId },
        process.env.JWT_SECRET,
        { expiresIn: "2h"}
    );

    response.status(200).json(
        { token }
    );
}

module.exports = {
    signupUser,
    loginUser
};
