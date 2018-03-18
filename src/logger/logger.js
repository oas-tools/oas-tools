
var winston = require('winston');
var config = require('../configurations/config');


/**
 * Configure here your custom levels.
 * */
var customLevels = {
  levels: {
    error: 7,
    warning: 8,
    custom: 9,
    info: 12,
    debug: 13
  },
  colors: {
    error: 'red',
    warning: 'yellow',
    custom: 'magenta',
    info: 'white',
    debug: 'blue'
  }
};

winston.emitErrs = true;
var logger = new winston.Logger({
  levels: customLevels.levels,
  colors: customLevels.colors,
  transports: [
    new winston.transports.File({
      level: config.loglevel,
      filename: config.logfile,
      handleExceptions: true,
      json: false,
      maxsize: 5242880, //5MB
      colorize: false
    }),
    new winston.transports.Console({
      level: config.loglevel,
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: true
    })
  ],
  exitOnError: false
});
