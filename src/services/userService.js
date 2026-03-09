const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const usersFile = path.join(__dirname, '../data/users.json');

const readUsers = async () => {
  const data = await fs.readFile(usersFile);
  return JSON.parse(data);
};

const writeUsers = async (users) => {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
};

exports.createUser = async (data) => {
  const users = await readUsers();
  const newUser = { id: uuidv4(), name: data.name, email: data.email };
  users.push(newUser);
  await writeUsers(users);
  return newUser;
};

exports.getUsers = async () => {
  return await readUsers();
};

exports.getUserById = async (id) => {
  const users = await readUsers();
  return users.find(u => u.id === id);
};

exports.deleteUser = async (id) => {
  let users = await readUsers();
  users = users.filter(u => u.id !== id);
  await writeUsers(users);
  return { message: 'User deleted' };
};