const express = require('express');
const schedulerController = require("../controllers/scheduler.controller");

const schedulerRoutes = express.Router();
schedulerRoutes.put('/flexiotauth07965489256790436759403765809436056857903/:flexiot_email', schedulerController.FlexiotAuthByFlexiotEmail);

module.exports = schedulerRoutes;
