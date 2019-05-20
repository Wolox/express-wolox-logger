const pino = require('pino');

const { getRequestId } = require('./namespace');
const logger = pino({
  prettyPrint: {
    translateTime: true,
    colorize: false
  }
});

const getRequestIdPrefix = () => {
  const requestId = getRequestId();
  return requestId ? `[${requestId}] ` : '';
};

const loggerWrapper = Object.keys(logger.levels.values).reduce((newLogger, logLevel) => {
  newLogger[logLevel] = (...args) => logger[logLevel](getRequestIdPrefix(), ...args);
  return newLogger;
}, {});

module.exports = { logger: loggerWrapper };
