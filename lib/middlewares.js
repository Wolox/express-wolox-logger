const onFinished = require('on-finished');

const { ns, setRequestId } = require('./namespace');
const { logger } = require('./logger');

const expressMiddleware = (req, res, next) => {
  const { method, params, query, body } = req;
  const url = req.originalUrl || req.url;

  logger.info(`Started ${url} ${method} with params:`, params, 'query:', query, 'body:', body);
  const begin = Date.now();
  const onFinish = (error, response) => {
    const end = Date.now();
    const responseTime = error ? '-' : end - begin;
    const status = response.statusCode;
    logger.info(`Ended ${method} ${url} with status: ${status} in ${responseTime} ms`);
  };
  onFinished(res, onFinish);
  next();
};

const expressRequestIdMiddleware = (req, res, next) => {
  ns.bindEmitter(req);
  ns.bindEmitter(res);
  return ns.run(() => {
    const requestId = req.headers['x-request-id'];
    setRequestId(requestId);
    next();
  });
};

module.exports = { expressMiddleware, expressRequestIdMiddleware };
