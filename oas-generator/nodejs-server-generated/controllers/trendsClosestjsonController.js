'use strict'

var trendsClosestjsonController = require('./trendsClosestjsonControllerService');

module.exports.trendsClosest = function trendsClosest(req, res, next) {
  trendsClosestjsonController.trendsClosest(req.swagger.params, res, next);
};

module.exports.trendsClosestJsonPARAMETERS = function trendsClosestJsonPARAMETERS(req, res, next) {
  trendsClosestjsonController.trendsClosestJsonPARAMETERS(req.swagger.params, res, next);
};