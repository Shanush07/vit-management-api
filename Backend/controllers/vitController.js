const fs = require("fs");
const path = require("path");
const ROLES_LIST = require("../config/roles_list");

const dataFilePath = path.join(__dirname, "../models/vitUsers.json");
let vitUsers = require("../models/vitUsers.json");

const saveUsers = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

const getAllUsers = (req, res) => {
  res.json(vitUsers);
};

const addUser = (req, res) => {
  if (!req?.roles?.includes(ROLES_LIST.Professor)) {
    return res.status(403).json({ message: "Only Professors can add users." });
  }

  const newUser = req.body;
  vitUsers.push(newUser);
  saveUsers(vitUsers);
  res.status(201).json({ message: "User added." });
};

const updateUser = (req, res) => {
  if (!req?.roles?.includes(ROLES_LIST.Professor)) {
    return res.status(403).json({ message: "Only Professors can update data." });
  }

  const user = vitUsers.find(u => u.id == req.body.id);
  if (!user) return res.status(404).json({ message: "User not found." });

  Object.assign(user, req.body);
  saveUsers(vitUsers);
  res.json({ message: "User updated." });
};

const deleteUser = (req, res) => {
  if (!req?.roles?.includes(ROLES_LIST.Admin)) {
    return res.status(403).json({ message: "Only Admin can delete users." });
  }

  vitUsers = vitUsers.filter(u => u.id != req.body.id);
  saveUsers(vitUsers);
  res.json({ message: "User deleted." });
};

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser
};
