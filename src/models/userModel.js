const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        validate: {
            validator: function (value) {
                // at least 1 uppercase, 1 lowercase, 1 number
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value);
            },
            message:
                "Password must contain at least 1 uppercase, 1 lowercase, and 1 number"
        }
    }
});

module.exports = mongoose.model('User', userSchema);

/**
 * const fs = require("fs").promises;
const path = require("path");

const file = path.join(__dirname, "../data/users.json");

exports.getUsers = async () => {
  const data = await fs.readFile(file);
  return JSON.parse(data);
};

exports.saveUsers = async (users) => {
  await fs.writeFile(file, JSON.stringify(users, null, 2));
};
 */