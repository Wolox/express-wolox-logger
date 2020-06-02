const { getRequestId } = require('../namespace');

const loggerOptions = ['pino'];

const getRequestIdPrefix = () => {
  const requestId = getRequestId();
  return requestId ? `[${requestId}] ` : '';
};

const isTesting = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'testing';
const logOnTesting = !!process.env.LOG_ON_TEST;

const createLogger = opts => {
  const { options, loggerOption = 'pino' } = opts || {};
  if (!loggerOptions.includes(loggerOption)) {
    throw new Error(`Logger '${loggerOption}' is not available, available loggers are [${loggerOptions}]`);
  }

  // eslint-disable-next-line global-require
  const { getLogger, getLogLevels } = require(`./${loggerOption}`);
  const logger = getLogger(options);
  const loggerWrapper = getLogLevels(logger).reduce((newLogger, logLevel) => {
    newLogger[logLevel] =
      isTesting && !logOnTesting ? () => true : (...args) => logger[logLevel](getRequestIdPrefix(), ...args);
    return newLogger;
  }, {});

  return { ...logger, ...loggerWrapper };
};

module.exports = { createLogger, logger: createLogger() };
