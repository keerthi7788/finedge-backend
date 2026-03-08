const userRepository = require("../repositories/userRepository");

exports.createUser = async (data) => {
  return await userRepository.createUser(data);
};

exports.getUsers = async () => {
  return await userRepository.getUsers();
};

exports.getUserById = async (id) => {
  return await userRepository.getUserById(id);
};

exports.deleteUser = async (id) => {
  await userRepository.deleteUser(id);
  return { message: "User deleted" };
};