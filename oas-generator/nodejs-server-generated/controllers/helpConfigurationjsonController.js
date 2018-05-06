'use strict'

var helpConfigurationjsonController = require('./helpConfigurationjsonControllerService');

module.exports.helpConfigurations = function helpConfigurations(req, res, next) {
  helpConfigurationjsonController.helpConfigurations(req.swagger.params, res, next);
};

module.exports.helpConfigurationJsonPARAMETERS = function helpConfigurationJsonPARAMETERS(req, res, next) {
  helpConfigurationjsonController.helpConfigurationJsonPARAMETERS(req.swagger.params, res, next);
};