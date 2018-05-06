'use strict'

var trendsAvailablejsonController = require('./trendsAvailablejsonControllerService');

module.exports.trendsAvailable = function trendsAvailable(req, res, next) {
  trendsAvailablejsonController.trendsAvailable(req.swagger.params, res, next);
};

module.exports.trendsAvailableJsonPARAMETERS = function trendsAvailableJsonPARAMETERS(req, res, next) {
  trendsAvailablejsonController.trendsAvailableJsonPARAMETERS(req.swagger.params, res, next);
};