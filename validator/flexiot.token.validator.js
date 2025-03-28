const yup = require('yup');

const createFlexiotTokenScheme = yup.object().shape({
  flexiot_email: yup.string().email().required(),
  Authorization: yup.string().required(),
  "X-IoT-JWT": yup.string().required(),
  created_at: yup.string().default(() => new Date().toISOString()),
  updated_at: yup.string().default(() => new Date().toISOString()),
})

module.exports = {
  createFlexiotTokenScheme
}
