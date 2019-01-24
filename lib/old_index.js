
const winston = require('winston'),
  fs = require('fs'),
  // config = require('../../config'),
  logDir = `${__dirname}/logs`;
winston.transports.DailyRotateFile = require('winston-daily-rotate-file');

// - Middleware para crear namespace y ademas generar y guardar un requestId asociado al request.
// - Metodo para obtener el requestId actual
// - Middleware pare loggear comienzo y final de un request
// - logger de winston con formato copado
// - logger que wrapea winston y recibe N parametros para stringificarlos a mano.

let exportable = null;

const initv3 = foo => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
    fs.mkdirSync(`${logDir}/history`);
  }

  const tsFormat = () => new Date().toLocaleTimeString();
  const logger = winston.createLogger({
    transports: [
      new winston.transports.File({
        name: 'complete',
        filename: `${logDir}/complete.log`,
        timestamp: tsFormat,
        json: false,
        colorize: false,
        prettyPrint: true
      }),
      new winston.transports.File({
        name: 'errors',
        filename: `${logDir}/errors.log`,
        timestamp: tsFormat,
        colorize: false,
        json: false,
        level: 'error',
        prettyPrint: true
        // handleExceptions: config.loggerHandlesExceptions,
        // humanReadableUnhandledException: config.loggerHandlesExceptions
      })
    ]
  });

  if (true) {
    logger.add(
      new winston.transports.Console({
        timestamp: tsFormat,
        colorize: false,
        prettyPrint: true
      })
    );
  }

  logger.add(
    new winston.transports.DailyRotateFile({
      filename: `${logDir}/history/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd.',
      colorize: false,
      prepend: true,
      json: false,
      level: 'info',
      prettyPrint: true
    })
  );
  exportable = Object.assign(logger, { initv2, initv3 });
  return exportable;
};

const initv2 = foo => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
    fs.mkdirSync(`${logDir}/history`);
  }
  
  const tsFormat = () => new Date().toLocaleTimeString();
  const logger = new winston.Logger({
    transports: [
      new winston.transports.File({
        name: 'complete',
        filename: `${logDir}/complete.log`,
        timestamp: tsFormat,
        json: false,
        colorize: false,
        prettyPrint: true
      }),
      new winston.transports.File({
        name: 'errors',
        filename: `${logDir}/errors.log`,
        timestamp: tsFormat,
        colorize: false,
        json: false,
        level: 'error',
        prettyPrint: true
        // handleExceptions: config.loggerHandlesExceptions,
        // humanReadableUnhandledException: config.loggerHandlesExceptions
      }),
      new winston.transports.DailyRotateFile({
        filename: `${logDir}/history/-results.log`,
        timestamp: tsFormat,
        datePattern: 'yyyy-MM-dd.',
        colorize: false,
        prepend: true,
        json: false,
        level: 'info',
        prettyPrint: true
      }),
      new winston.transports.Console({
        timestamp: tsFormat,
        colorize: false,
        prettyPrint: true
      })
    ]
  });
  exportable = Object.assign(logger, { initv2, initv3 });
  return exportable;
};

// module.exports = Object.assign(logger, { init });
module.exports = exportable || initv3();