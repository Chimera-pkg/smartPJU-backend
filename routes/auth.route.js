const express = require('express');
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const authRoutes = express.Router();

authRoutes.post('/register', authController.Register);
authRoutes.post('/login', authController.Login);
authRoutes.get('/logout', authMiddleware.tokenValidator, authController.Logout);
authRoutes.put('/refreshtoken/:refresh_token', authController.RefreshToken);

module.exports = authRoutes;