const router = require('express').Router();
const { login } = require('../controllers/users');
const { validateSignin } = require('../middlewares/validation');

router.post('/signin', validateSignin, login);

module.exports = router;
