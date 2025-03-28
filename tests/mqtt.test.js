const mqtt = require("mqtt")

async function main() {
  const connectUrl = `mqtt://devdeviceconnect.iot.xpand.asia:1893`

  const client = mqtt.connect(connectUrl, {
    clientId: "dashboard-smart-pju",
    clean: true,
    connectTimeout: 4000,
    username: '',
    password: '1638343277_6807',
    reconnectPeriod: 1000,
  })

  client.on("error", err => {
    console.error('MQTT ERROR：', err)
    client.end();
    client.reconnect();
  })


  // client.on("message", (payload, b) => {
  //   // console.log(JSON.parse(b.toString()));
  // })

  client.on("connect", () => {
    console.log("connected");

    // actions
    // client.subscribe("+/8756408788510687/xlkm_xcamp_dashboard/development/v1/sub");

    client.subscribe("dashboard/development/v1/common")

    function random(min, max) {
      return (Math.random() * (max - min + 1) + min).toFixed(1);
    }

    let payload1 = {
      eventName: "smart_pju_data",
      mac: "7810015509295740",
      power: (random(233, 236) * random(0.004, 0.005)).toFixed(1),
      voltage: random(233, 236),
      current: random(0.004, 0.006),
      device_label: "pemprov_dki1",
      kwh: 0.03
    }

    // let payload2 = {
    //   eventName: "smart_pju_data",
    //   mac: "3967342430188475",
    //   power: random(234, 236) * random(1, 4),
    //   voltage: random(234, 236),
    //   current: random(1, 4),
    //   device_label: "pemprov_dki1",
    //   kwh: 0.03
    // }
    //
    // let payload3 = {
    //   eventName: "smart_pju_data",
    //   mac: "4796467443127528",
    //   power: (random(234, 236) * random(1.1, 4)).toFixed(1),
    //   voltage: random(234, 236),
    //   current: random(2, 5),
    //   device_label: "pemprov_dki1",
    //   kwh: 0.03
    // }

    setInterval(() => {
      payload1.voltage = random(234, 236)
      payload1.current = random(0.004, 0.020)
      payload1.power = (payload1.current * payload1.voltage).toFixed(1)

      // payload2.power = (random(234, 236) * random(2, 4)).toFixed(1)
      // payload2.voltage = random(234, 236)
      // payload2.current = random(2, 4)
      //
      // payload3.power = (random(234, 236) * random(2, 4)).toFixed(1)
      // payload3.voltage = random(234, 236)
      // payload3.current = random(2, 4)
      //
      payload1.kwh += 0.0005
      // payload2.kwh += 0.02
      // payload3.kwh += 0.14
    })

    // send iot datafile:///snap/teams-insiders/7/usr/share/teams-insiders/resources/app.asar/assets/teams_welcomescreen_v2.svg
    setInterval(() => {

      client.publish("_dashboard/development/v1/common", JSON.stringify(payload1))
      // client.publish("dashboard/development/v1/common", JSON.stringify(payload2))
      // client.publish("dashboard/development/v1/common", JSON.stringify(payload3))

    }, 4000)


  })

}

module.exports = {main}
