const yup = require('yup');

const registerUserScheme = yup.object().shape({
  name: yup.string().trim().min(3).required(),
  email: yup.string().trim().email().required(),
  password: yup.string().trim().min(6).required(),
  retype_password: yup.string().trim()
    .oneOf([yup.ref('password'), null])
    .required()
})

const loginUserScheme = yup.object().shape({
  email: yup.string().trim().email().required(),
  password: yup.string().trim().min(6).required('minimum password is 6'),
})

module.exports = {
  registerUserScheme,
  loginUserScheme
}
