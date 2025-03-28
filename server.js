const express = require('express');
const app = express();
const cors = require('cors');
const {ConnectDB} = require('./configs/mongo.config');
const {headerMiddleware, loggerMiddleware} = require("./middlewares/global.middleware");
const {errorResponder} = require("./middlewares/errorResponder.middleware");

// configs management
require('dotenv').config();
const PORT = process.env.PORT;

// routes
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const dashboardRoutes = require("./routes/dashboard.route");
const deviceRoutes = require("./routes/device.route");
const schedulerRoutes = require("./routes/scheduler.route");
const {RunScheduler} = require("./services/scheduler.service");
const {Api} = require("./utils/httpReq.util");
const {ErrAxios} = require("./utils/errors/validation.error");

// middlewares
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})
app.use(express.urlencoded({extended: true}))
app.use(headerMiddleware);
app.use(loggerMiddleware);

//////////////////////////////// TEST //////////////////////////////////
app.get('/tests', (req, res) => {
  console.log(req.headers)
  res.status(200).send("ok");
})

// router group
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/device', deviceRoutes);
app.use('/scheduler', schedulerRoutes);

// error responder
app.use(errorResponder);

// mongo connection
ConnectDB(3000).then(async () => {
  await RunScheduler();

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });

  await Api.put("/device/realtimeupdate").catch(e => console.log(new ErrAxios(e)))

}).catch(e => {
  console.log(`can't start service: ${e}`);
})

// tests script
// require('./tests/test').runner()
