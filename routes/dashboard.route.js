const express = require('express');
const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const dashboardRoutes = express.Router();
dashboardRoutes.put('/update/:dashboard_id', authMiddleware.tokenValidator, dashboardController.UpdateDashboardByIdAndUserId);
dashboardRoutes.put('/sync/:device_label', authMiddleware.tokenValidator, dashboardController.SyncDashboard);
dashboardRoutes.get('/getall', authMiddleware.tokenValidator, dashboardController.GetAllDashboardByUserId);
dashboardRoutes.post('/create', authMiddleware.tokenValidator, dashboardController.CreateDashboard);

module.exports = dashboardRoutes;
