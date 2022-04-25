const router = require('express').Router();
const auth = require('../middlewares/auth');

router.use(require('./signup'));
router.use(require('./signin'));
router.use('/movies', auth, require('./movies'));
router.use('/users', auth, require('./users'));

module.exports = router;
