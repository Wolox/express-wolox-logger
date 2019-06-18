const loggers = require('./loggers');
const middlewares = require('./middlewares');
const namespace = require('./namespace');

module.exports = {
  ...loggers,
  ...middlewares,
  ...namespace
};
