const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  accountEmail: {
    // The email address for admin user to log in. This used to group all family & friends to the same account once admin has craeted users / profile for members to login 
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    
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
  userName: {
    // each users username for login access.
    type: String,
    unique: true
  },
  phonenumber: {
    // Users phone number.
    type: String
  },
  child: {
    // this is if the user is a child === true, adult === false
    type: Boolean,
    default: false
  },
  admin: {
    // If the user has admin rights or not.
    type: Boolean,
    default: true
  },
  userImage: {
    // The user can add a Avatar to their profile.
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
