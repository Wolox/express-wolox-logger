const { logger } = require('./logger');
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
