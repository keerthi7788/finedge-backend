const userService = require("../services/userService");

exports.createUser = async (req, res) => {
  console.log("Creating user with data:", req.body);
  const user = await userService.createUser(req.body);
  res.json(user);
};

exports.getUsers = async (req, res) => {
  const users = await userService.getUsers();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  res.json(result);
};