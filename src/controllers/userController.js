const { User } = require("../models/UserModel");

const bcrypt = require("bcrypt");


async function createUser(request, response) {
  try {

    const {  password, userName, ...fields } = request.body;

// Use bcrypt to hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt value

    // Check if username already exists
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
        return response.status(400).json({ message: "This username is already in use. Please use another username!" });
    }

    const user = await User.create(
      { ...fields,
        userName,
        password: hashedPassword,
       }
    ); // Create the entire body with hashed password.

    response.status(201).json({
      message: "Profile details created successfully",
      user: user
  });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

async function getAllUsers(request, response) {
  try {
    const  { accountEmail }  = request.authUserData;

    const users = await User.find({ accountEmail });

    if (!users || users.length === 0) {
      return response.status(404).json({ message: "No profiles not found" });
    }

    response.status(200).json({
      message: "Profiles have been found.",
      users: users
    });

  } catch (error) {
    console.error("Error in getAllUsers", error);
    response.status(500).json({ message: error.message });
  }
}

async function getUser(request, response) {
  try {
    const { accountEmail } = request.authUserData;
     
    const { id } = request.params;

    // Search for the profile by id.
    const user = await User.findOne({ _id: id });

    if (!user) {
      return response.status(404).json({ message: 'Profile not found' });
    }

    response.status(200).json({
      message: "Profile details found.",
      user: user
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

async function updateUser(request, response) {
  try {
    const { accountEmail } = request.authUserData;

    const  id  = request.params.id;
    const { password, firstname, lastname, userName, phonenumber, child, admin, userImage, age  } = request.body;

    // Find the user based on _id
    const user = await User.findOne({ _id: id });

    if (!user) {
      return response.status(404).json({ message: 'Profile not found' });
    }

  // Use bcrypt to hash the password
  if (password) {
    user.password = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt
  }

    // Update the user with the new data from the request body
    user.firstname = firstname;
    user.lastname = lastname;
    user.userName = userName;
    user.phonenumber = phonenumber;
    user.child = child;  
    user.admin = admin;
    user.userImage = userImage;  
    user.age = age;

    // Save the updated user
    await user.save();

    // Return the updated user
    response.status(200).json({
      message: "Profile details have been updated.",
      user: user
  });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

async function deleteUser(request, response) {
  try {
    const { accountEmail } = request.authUserData;

    const id = request.params.id; // Get id from request params

    // Find and delete the user based on _id
    const deleteDetails = await User.deleteOne({ _id: id  });

    // If no user was deleted, return a 404 response
    if (deleteDetails === 0) {
      return response.status(404).json({ message: 'Profile was not found !' });
    }

    // Return response when deleted
    response.status(200).json({ message: 'Profile details have been deleted successfully.' });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
};
  
  
