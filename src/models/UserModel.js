const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    // The email address for a user to log in.
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
    minLength: 6
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
