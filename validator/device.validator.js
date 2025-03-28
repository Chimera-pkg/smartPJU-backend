const yup = require('yup');

const setActionScheme = yup.object().shape({
  action_name: yup.string().required(),
  flexiot_user_id: yup.number().required(),
  device_label: yup.string().required(),
  action_param: yup.object()
})

module.exports = {
  setActionScheme
}
