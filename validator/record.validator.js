const yup = require('yup');

const createRecordScheme = yup.object().shape({
  device_label: yup.string().required(),
  kwh: yup.number().required(),
  mac: yup.string().required(),
  datetime: yup.string().required(),
})

module.exports = {
  createRecordScheme
}
