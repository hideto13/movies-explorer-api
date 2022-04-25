const {
  MONGO_DATA_BASE = 'mongodb://localhost:27017/moviesdb-dev',
  NODE_ENV = 'development',
  JWT_SECRET,
  JWT_DEV_SECRET = 'Dev-secret',
  PORT = 3001,
} = process.env;

module.exports = {
  MONGO_DATA_BASE,
  NODE_ENV,
  JWT_SECRET,
  JWT_DEV_SECRET,
  PORT,
};
