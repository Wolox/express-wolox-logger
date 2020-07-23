const pino = require('pino');

const { getLogMetadata } = require('../context');

module.exports = {
  getLogLevels: logger => Object.keys(logger.levels.values),
  getLogger: (options = {}) =>
    pino({
      ...options,
      mixin: () => ({ ...getLogMetadata() })
    })
};
