const users = require('../models/userModel');
const bcrypt = require('bcrypt');
const SALT_ROUND = 10;
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const userService = require('../services/userService');

// Function to register a new user
const registerUser = async (user) => {
    try {
        const tempUser = new users(user);
        await tempUser.validate();

        user.password = await bcrypt.hash(user.password, SALT_ROUND);
        const dbUser = await users.create(user);
        return { message: 'User registered successfully', user: dbUser, status: 200 };
    } catch (error) {
        const status = 400;
        const message = error.message;
        return { status, message, user: null };
    }
};

const loginUser = async ({ email, password }) => {
    try {
        const dbUser = await users.findOne({ email });

        if (!dbUser) {
            return { message: 'User not found', token: null };
        }

        const isSamePassword = await bcrypt.compare(password, dbUser.password);

        if (!isSamePassword) {
            return { message: 'Wrong password', token: null };
        }

        const token = jwt.sign({ username: dbUser.name, email: dbUser.email }, JWT_SECRET, { expiresIn: '1h' });
        return { message: 'Login successful', token };
    } catch (error) {
        return { message: error.message, token: null, status: 500 };
    }
}

const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.json(user);
};

const getUsers = async (req, res) => {
  const users = await userService.getUsers();
  res.json(users);
};

const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
};

const deleteUser = async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  res.json(result);
};

module.exports = {
    registerUser,
    loginUser,
    createUser,
    getUsers,
    getUserById,
    deleteUser
}