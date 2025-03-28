class validator {
  err = "";

  isValid(schema, payload) {
    schema.validate(payload).catch(e => this.err = e.message);
    return this.err === "";
  }
}

module.exports = {validator}