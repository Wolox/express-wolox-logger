const onFinished = require('on-finished');
const shortid = require('shortid');

const { namespace, setRequestId } = require('./namespace');

const secure = '[SECURE]';

const getSecureBody = ({ params, url, method, body, placeholder }) => {
  try {
    if (params === true) {
      return placeholder;
    }
    if (params && typeof params === 'object') {
      const path = Object.keys(params).find(pathRegex => new RegExp(pathRegex).test(url));
      if (path && params[path] && params[path][method]) {
        // TODO: Here we should add the specific param obfuscation logic
        return placeholder;
      }
    }
    return body;
  } catch (_) {
    return placeholder;
  }
};

const logStartMsg = ({ req, formattedBody, loggerFn, startFn }) => {
  if (startFn) {
    return startFn({ req, formattedBody });
  }

  const { method, params, query } = req;
  const url = req.originalUrl || req.url;
  return loggerFn(
    `Started ${url} ${method} with params: %j query: %j body: %j`,
    params || {},
    query || {},
    formattedBody || {}
  );
};

const logEndMsg = ({ req, res, loggerFn, endFn, responseTime }) => {
  if (endFn) {
    return endFn({ req, res, responseTime });
  }

  const { method } = req;
  const url = req.originalUrl || req.url;
  const status = res.statusCode;
  return loggerFn(`Ended ${method} ${url} with status: ${status} in ${responseTime} ms`);
};

const expressMiddleware = opts => {
  // TODO: add a check that all the config is safe
  const { loggerFn, startFn, endFn, obfuscateBody = true, obfuscatePlaceholder = secure } = opts || {};
  if (!loggerFn && (!startFn || !endFn)) throw Error('You need to define a loggerFn or a startFn and endFn');

  return (req, res, next) => {
    const { method, body } = req;
    const url = req.originalUrl || req.url;
    const formattedBody = getSecureBody({
      params: obfuscateBody,
      url,
      method,
      body,
      placeholder: obfuscatePlaceholder
    });

    logStartMsg({ req, formattedBody, loggerFn, startFn });
    const begin = Date.now();
    const onFinish = namespace.bind((error, response) => {
      const end = Date.now();
      const responseTime = error ? '-' : end - begin;
      logEndMsg({ req, res: response, loggerFn, endFn, responseTime });
    });
    onFinished(res, onFinish);
    next();
  };
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
