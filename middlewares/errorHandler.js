const { ERROR_CODE_DEFAULT, ERROR_MESSAGE_DEFAULT } = require('../constants');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || ERROR_CODE_DEFAULT;
  const message = statusCode === ERROR_CODE_DEFAULT ? ERROR_MESSAGE_DEFAULT : err.message;

  res.status(statusCode).send({ message });
  next();
};
