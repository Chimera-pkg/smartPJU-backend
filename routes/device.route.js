const express = require('express');
const deviceController = require("../controllers/device.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const deviceRoutes = express.Router();
deviceRoutes.get('/:device_label', authMiddleware.tokenValidator, deviceController.GetAllDeviceData);
deviceRoutes.post('/action', authMiddleware.tokenValidator, deviceController.DeviceAction);
deviceRoutes.get('/historydata/:dashboard_id', authMiddleware.tokenValidator, deviceController.GetHistoryData);
deviceRoutes.put('/realtimeupdate', deviceController.DeviceRealtimeUpdate);

module.exports = deviceRoutes;
