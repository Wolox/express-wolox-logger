const onFinished = require('on-finished');
const shortid = require('shortid');

const { ns, setRequestId } = require('./namespace');

const expressMiddleware = opts => (req, res, next) => {
  const { method, params, query, body } = req;
  const url = req.originalUrl || req.url;
  const { logger } = opts || {};

  logger.info(
    `Started ${url} ${method} with params:`,
    params || {},
    'query:',
    query || {},
    'body:',
    body || {}
  );
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

const expressRequestIdMiddleware = opts => (req, res, next) => {
  const { headerName = 'x-request-id', idGenerator = shortid.generate } = opts || {};
  ns.bindEmitter(req);
  ns.bindEmitter(res);
  return ns.run(() => {
    const requestId = req.headers[headerName] || idGenerator();
    setRequestId(requestId);
    next();
  });
};

module.exports = { expressMiddleware, expressRequestIdMiddleware };
