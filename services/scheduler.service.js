const cron = require('node-cron');
const {getAllUser} = require("./user.service");
const axios = require("axios");

const ROOT_URL = "http://localhost:5000";

// "*/30 * * * *" -> cronjob run once every 30 minutes
const SCHEDULER_TIME = "*/30 * * * *";

// scheduler object pool
let SCHEDULER_LIST = [];

// scheduler object pool cleaner
// stop all listed schedulers then reset scheduler object pool
function cleanScheduler() {
  SCHEDULER_LIST.map(s => {
    s.scheduler_object.stop();
  });

  SCHEDULER_LIST = [];
}

// run scheduler
async function RunScheduler() {
  cleanScheduler();

  let err;
  const userList = await getAllUser().catch(e => err = e);
  if (err) {
    console.log("==== SCHEDULER IS FAILING ====");
    console.log(err.message)
    console.log(err.stack)
    process.exit(1);
  }

  // remove duplications
  const emailList = [...new Set(userList.map(({flexiot_email}) => flexiot_email))]

  // parse to flexiot email list into SCHEDULER_LIST
  emailList.map(email => {
    // job
    const job = () => axios.put(`${ROOT_URL}/scheduler/flexiotauth07965489256790436759403765809436056857903/${email}`)
      .then(() => console.log("successfully updating flexiot account", email))
      .catch(e => console.log("ERROR:", e.response?.data?.message))

    // fetch for the first time
    // don't have to wait until cron time reached
    job();

    // define scheduler task
    const task = cron.schedule(SCHEDULER_TIME, job, {scheduled: true});
    task.start();

    // add to scheduler object pool
    SCHEDULER_LIST.push({flexiot_email: email, scheduler_object: task});
  });

}

// update scheduler
function UpdateScheduler() {
  SCHEDULER_LIST.map(s => {
    s.scheduler_object.stop();
  });

  SCHEDULER_LIST = [];
}


module.exports = {
  RunScheduler,
  UpdateScheduler
}
