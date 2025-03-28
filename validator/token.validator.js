const yup = require('yup');

const createTokenScheme = yup.object().shape({
  email: yup.string().email().required('email is required'),
  user_id: yup.string().required('user_id is required'),
  created_at: yup.string().default(() => new Date().toISOString()),
  updated_at: yup.string().default(() => new Date().toISOString()),
})

module.exports = {
  createTokenScheme
}
