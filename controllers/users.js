const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET, JWT_DEV_SECRET } = require('../config');
const { ERROR_MESSAGE_CONFLICT, ERROR_MESSAGE_NOT_FOUND_ID } = require('../constants');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFound');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequesError');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_ID);
    })
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch(next);
};

module.exports.updateCurrentUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name, email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_ID);
    })
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      }
      if (err.code === 11000) {
        next(new ConflictError(ERROR_MESSAGE_CONFLICT));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      }
      if (err.code === 11000) {
        next(
          new ConflictError(
            ERROR_MESSAGE_CONFLICT,
          ),
        );
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET,
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
};
