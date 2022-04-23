const User = require('../models/user');
const NotFoundError = require('../errors/NotFound');
const BadRequestError = require('../errors/BadRequesError');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('ID не найден');
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
      throw new NotFoundError('ID не найден');
    })
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
};
