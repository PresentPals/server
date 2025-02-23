const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  accountEmail: {
    // The email address for admin user to log in. This used to group all family & friends to the same account
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/i, "Please enter a valid email address"]
  },
  password: {
    // The user password to login.
    type: String,
    required: true,
    minLength: 8
  },
  firstname: {
    // Users first name.
    type: String,
    required: true
  },
  lastname: {
    // Users last name.
    type: String,
    required: true
  },
  userEmail: {
    // each users email address (for users reference only).
    type: String
  },
  phonenumber: {
    // Users phone number.
    type: String
  },
  admin: {
    // If the user has admin rights or not.
    type: Boolean,
    required: true,
    default: true
  },
  avatar: {
    // The user can add their own avatar image.
    type: String
  },
  userImage: {
    // The user can add a image of themselves.
    type: String
  },
  age: {
    // Age of the user.
    type: Number,
    min: 0,
    max: 110
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = {
  User
};
