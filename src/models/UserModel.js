const mongoose =require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/i, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstname: {
        type: String,
        required: true
    },
    lastnname: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true,
        default: true
    },
    avatar: {
        type: String
    },
    userImage: {
        type: String
    },
    age: {
        type: Number,
        min: 0,
        max: 110
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = {
    User
};