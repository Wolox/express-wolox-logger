const pino = require('pino');

const defaultPinoOptions = {
  prettyPrint: {
    translateTime: true,
    colorize: false
  }
};

module.exports = {
  getLogLevels: logger => Object.keys(logger.levels.values),
  getLogger: (options = defaultPinoOptions) => pino(options)
};
