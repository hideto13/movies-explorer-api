require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  MONGO_DATA_BASE,
  PORT,
} = require('./config');
const NotFoundError = require('./errors/NotFound');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_DATA_BASE);

app.use(requestLogger);

app.use(cors());

app.use(require('./routes'));

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Некорректный запрос'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);
