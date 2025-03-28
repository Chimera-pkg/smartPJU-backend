const {main} = require("./mqtt.test");

// const X_SECRET = "Zk1PUXZZamFUOWI4N25XMG5hOERRWVBpTTVRYTpzNzJleHBkZm14c1BSaDgxclhrUURFR2hfUG9h";
// const FLEXIOT_USERNAME = "yosiaagustadewa@gmail.com";
// const FLEXIOT_PASSWORD = "bangagus123";

async function runner() {
  await main()

  // let err;
  // const iotDeviceResults = await iotDeviceColl
  //   .getAllIotDeviceByDeviceLabel("pemprov_dki1")
  //   .catch(e => err = new MdbErrInternal('iotDevice', e));
  // if (err) console.log(err);
  // console.log(iotDeviceResults)
}

module.exports = {runner}
