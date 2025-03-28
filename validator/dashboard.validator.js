const yup = require('yup');

const createDashboardScheme = yup.object().shape({
  name: yup.string().min(3).required(),
  cost_per_kwh: yup.number().min(1).required(),
  event_name: yup.string().min(3).required(),
  device_label: yup.string().min(3).required(),
})

module.exports = {
  createDashboardScheme
}
