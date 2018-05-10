'use strict';

var config = require('../configurations'),
  logger = config.logger;

var exports;
exports = module.exports = function(options) {
  return function(req, res, next) {
    if (options != undefined) {
      logger.debug("<empty_middleware> Router middleware: " + options.controllers);
      config.controllers = options.controllers;
    } else {
      logger.debug("<empty_middleware> This does nothing actually.");
    }
    next();
  }
}
