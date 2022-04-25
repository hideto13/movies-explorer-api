const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCurrentUser,
  updateCurrentUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/users/me', auth, getCurrentUser);

router.patch(
  '/users/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
    }),
  }),
  updateCurrentUser,
);

module.exports = router;
