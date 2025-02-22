const { User } = require("../models/UserModel");

async function createUser(request, response) {
  try {
    const user = await User.create(request.body); // Create the entire body 

    response.status(201).json({
      message: "User details created successfully",
      user: user
  });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

async function getUser(request, response) {
  try {
    const { firstname, lastname } = request.body;  // Get firstname and lastname from the request body

    // Search for the user by where both firstname and lastname must match
    const user = await User.findOne({
      where: { firstname, lastname },  
    });

    if (!user) {
      return response.status(404).json({ message: 'User names not found' });
    }

    response.status(200).json({
      message: "User details found.",
      user: user
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

async function updateUser(request, response) {
  try {
    const { firstname, lastname, phonenumber, avatar, userImage, age, admin } = request.body;

    // Find the user based on firstname and lastname
    const user = await User.findOne({
      where: { firstname, lastname },
    });

    if (!user) {
      return response.status(404).json({ message: 'User names not found' });
    }

    // Update the user with the new data from the request body
    await user.update({        
      phonenumber,   
      avatar,        
      userImage,     
      age,          
      admin,         
    });

    // Return the updated user
    response.status(200).json({
      message: "User details have been updated.",
      user: user
  });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

async function deleteUser(request, response) {
  try {
    const { firstname, lastname } = request.body; // Get firstname and lastname from request body

    // Find and delete the user based on firstname and lastname
    const deleteDetails = await User.destroy({
      where: { firstname, lastname },
    });

    // If no user was deleted, return a 404 response
    if (deleteDetails === 0) {
      return response.status(404).json({ message: 'Users firstname & lastname were not found !' });
    }

    // Return response when deleted
    response.status(200).json({ message: 'Users details have been deleted successfully.' });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser
};
  
  
