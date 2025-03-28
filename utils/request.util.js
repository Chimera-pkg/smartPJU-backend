function pickQuery(object, keys = []) {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) obj[key] = object[key];
    return obj;
  }, {});
}

module.exports = {pickQuery}