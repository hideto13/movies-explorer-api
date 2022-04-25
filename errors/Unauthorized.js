const { ERROR_CODE_UNAUTHORIZED } = require('../constants');

class UnauthirizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_UNAUTHORIZED;
  }
}

module.exports = UnauthirizedError;
