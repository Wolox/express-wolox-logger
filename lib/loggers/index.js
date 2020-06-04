const loggerOptions = ['pino'];

const createLogger = opts => {
  const { options, loggerOption = 'pino' } = opts || {};
  if (!loggerOptions.includes(loggerOption)) {
    throw new Error(`Logger '${loggerOption}' is not available, available loggers are [${loggerOptions}]`);
  }
  // eslint-disable-next-line global-require
  const { getLogger } = require(`./${loggerOption}`);
  return getLogger(options);
};

module.exports = { createLogger, logger: createLogger() };
