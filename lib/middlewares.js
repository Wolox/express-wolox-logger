const onFinished = require('on-finished');
const shortid = require('shortid');

const { namespace, setRequestId } = require('./namespace');

const expressMiddleware = opts => (req, res, next) => {
  const { method, params, query, body } = req;
  const url = req.originalUrl || req.url;
  const { loggerFn } = opts || {};

  loggerFn(`Started ${url} ${method} with params:`, params || {}, 'query:', query || {}, 'body:', body || {});
  const begin = Date.now();
  const onFinish = namespace.bind((error, response) => {
    const end = Date.now();
    const responseTime = error ? '-' : end - begin;
    const status = response.statusCode;
    loggerFn(`Ended ${method} ${url} with status: ${status} in ${responseTime} ms`);
  });
  onFinished(res, onFinish);
  next();
};

const expressRequestIdMiddleware = opts => (req, res, next) => {
  const { headerName = 'x-request-id', idGenerator = shortid.generate } = opts || {};
  namespace.bindEmitter(req);
  namespace.bindEmitter(res);
  return namespace.run(() => {
    const requestId = req.headers[headerName] || idGenerator();
    setRequestId(requestId);
    next();
  });
};

module.exports = { expressMiddleware, expressRequestIdMiddleware };
