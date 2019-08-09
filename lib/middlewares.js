const onFinished = require('on-finished');
const shortid = require('shortid');

const { namespace, setRequestId } = require('./namespace');

const replaceSecrets = (object = {}, secrets = {}) => ({ ...object, ...secrets });

const expressMiddleware = opts => (req, res, next) => {
  const { method, params, query, body } = req;
  const url = req.originalUrl || req.url;
  const { loggerFn, optionsByPath = {} } = opts || {};
  const path = Object.keys(optionsByPath).find(pathRegex => new RegExp(pathRegex).test(url));
  const { secrets } = optionsByPath[path] || {};
  const formattedBody = replaceSecrets(body, secrets);

  loggerFn(
    `Started ${url} ${method} with params:`,
    params || {},
    'query:',
    query || {},
    'body:',
    formattedBody || {}
  );
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
