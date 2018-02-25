'use strict';

/**
 * Module dependecies.
 * */

var winston = require('winston');
var config = require('../configurations/config');
var enableLogs = true;

/**
 * Configure here your custom levels.
 * */
var customLeves = {
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
    debug: 'black'
  }
};

winston.emitErrs = true;

if (enableLogs == true) {
  var logger = new winston.Logger({
    levels: customLeves.levels,
    colors: customLeves.colors,
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
}else{
  var logger = new winston.Logger({
    levels: customLeves.levels,
    colors: customLeves.colors,
    exitOnError: false
  });
}


/*
 * Export functions and Objects
 */
module.exports = logger;
