const express = require('express');
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const userRoutes = express.Router();
userRoutes.put('/update', authMiddleware.tokenValidator, userController.UpdateUser);
userRoutes.get('/get', authMiddleware.tokenValidator, userController.GetUser);

module.exports = userRoutes;