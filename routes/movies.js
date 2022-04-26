const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { validateDeleteMovie, validateCreateMovie } = require('../middlewares/validation');

router.get('/', getMovies);

router.delete('/:_id', validateDeleteMovie, deleteMovie);

router.post('/', validateCreateMovie, createMovie);

module.exports = router;
