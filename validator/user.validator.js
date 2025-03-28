const yup = require('yup');

const createUserScheme = yup.object().shape({
  name: yup.string().trim().min(3).required(),
  email: yup.string().trim().email().required(),
  password: yup.string().trim().min(6).required(),
  retype_password: yup.string().trim()
    .oneOf([yup.ref('password'), null])
    .required(),
  flexiot_email: yup.string().email().required(),
  flexiot_password: yup.string().min(6).required(),
  flexiot_retype_password: yup.string()
    .oneOf([yup.ref('flexiot_password'), null])
    .required(),
  flexiot_x_secret: yup.string().required()
})

module.exports = {
  createUserScheme
}
