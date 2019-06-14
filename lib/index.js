const { logger } = require('./loggers');
const { expressMiddleware, expressRequestIdMiddleware } = require('./middlewares');
const { setRequestId, getRequestId, ns } = require('./namespace');

module.exports = {
  logger,
  expressMiddleware,
  expressRequestIdMiddleware,
  getRequestId,
  setRequestId,
  ns
};
