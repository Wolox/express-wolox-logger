const { createNamespace, getNamespace } = require('cls-hooked'),
  uuid = require('uuid/v4'),
  pino = require('pino'),
  onFinished = require('on-finished'),
  NAMESPACE = '35033c64-af8d-4a53-80cf-7a1206dd0dfd';

const logger = pino({
  prettyPrint: {
    translateTime: true,
    colorize: false
  }
});

const namespace = createNamespace(NAMESPACE);

const getRequestId = () => {
  return namespace ? namespace.get('requestId') : null;
};

const setRequestId = (id = uuid()) => {
  namespace.set('requestId', id);
  return id;
}

const prependRequestId = (msg) => {
  const requestId = getRequestId();
  const prefix = requestId ? `[${requestId}] ` : '';
  return `${prefix}${msg}`;
}

const info = msg => logger.info(prependRequestId(msg));
const error = msg => logger.error(prependRequestId(msg));

const expressMiddleware = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl || req.url;
  const params = JSON.stringify(req.params);
  const query = JSON.stringify(req.query);
  const body = JSON.stringify(req.body);

  info(
    `Started ${method} ${url} with params: ${params}, query: ${query}, body: ${body}.`
  );
  const begin = Date.now();
  const foo = namespace.bind((error, response) => {
    const end = Date.now();
    const responseTime = error ? '-' : end - begin;
    const status = response.statusCode;
    info(`Ended ${method} ${url} with status: ${status} in ${responseTime} ms`);
  });
  onFinished(res, foo);
  next();
};

const expressRequestIdMiddleware = (req, res, next) => {
  namespace.bindEmitter(req);
  namespace.bindEmitter(res);
  return namespace.run(() => {
    const requestId = req.headers['x-request-id'] || uuid();
    setRequestId(requestId);
    next();
  });
};

module.exports = { logger: { ...logger, info, error }, expressMiddleware, expressRequestIdMiddleware, getRequestId, setRequestId, namespace };
