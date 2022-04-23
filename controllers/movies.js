const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFound');
const ForbiddenError = require('../errors/Forbidden');
const BadRequestError = require('../errors/BadRequesError');

const getMovieObj = (movie) => {
  const obj = {
    _id: movie._id,
    movieId: movie.movieId,
    country: movie.country,
    director: movie.director,
    duration: movie.duration,
    year: movie.year,
    description: movie.description,
    image: movie.image,
    trailerLink: movie.trailerLink,
    nameRU: movie.nameRU,
    nameEN: movie.nameEN,
    thumbnail: movie.thumbnail,
  };
  return obj;
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies.map((movie) => getMovieObj(movie))))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(getMovieObj(movie)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      throw new NotFoundError('ID не найден');
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нет доступа');
      }
    }).then(() => Movie.deleteOne({ _id: req.params._id })
      .then((movie) => {
        res.send(getMovieObj(movie));
      }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректно введен ID'));
      } else {
        next(err);
      }
    });
};
