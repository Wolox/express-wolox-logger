const { getRequestId } = require('../namespace');

const loggerOptions = ['pino'];

const getRequestIdPrefix = () => {
  const requestId = getRequestId();
  return requestId ? `[${requestId}] ` : '';
};

const createLogger = opts => {
  const { options, loggerOption = 'pino' } = opts || {};
  if (!loggerOptions.includes(loggerOption)) {
    throw new Error(`Logger '${loggerOption}' is not available, available loggers are [${loggerOptions}]`);
  }

  const { getLogger, getLogLevels } = require(`./${loggerOption}`);
  const logger = getLogger(options);
  const loggerWrapper = getLogLevels(logger).reduce((newLogger, logLevel) => {
    newLogger[logLevel] = (...args) => logger[logLevel](getRequestIdPrefix(), ...args);
    return newLogger;
  }, {});

  return { ...logger, ...loggerWrapper };
};

module.exports = { createLogger, logger: createLogger() };
