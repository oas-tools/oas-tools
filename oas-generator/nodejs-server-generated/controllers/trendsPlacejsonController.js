'use strict'

var trendsPlacejsonController = require('./trendsPlacejsonControllerService');

module.exports.trendsPlace = function trendsPlace(req, res, next) {
  trendsPlacejsonController.trendsPlace(req.swagger.params, res, next);
};

module.exports.trendsPlaceJsonPARAMETERS = function trendsPlaceJsonPARAMETERS(req, res, next) {
  trendsPlacejsonController.trendsPlaceJsonPARAMETERS(req.swagger.params, res, next);
};