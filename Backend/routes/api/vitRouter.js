const {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser
} = require('../../controllers/vitController');

const express = require('express');
const vitRouter = express.Router();
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

vitRouter.route('/')
  .get(getAllUsers)
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Professor), addUser)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Professor), updateUser)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteUser);

module.exports = vitRouter;
