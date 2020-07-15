const loggers = require('./loggers');
const middlewares = require('./middlewares');
const context = require('./context');

module.exports = {
  ...loggers,
  ...middlewares,
  ...context
};
